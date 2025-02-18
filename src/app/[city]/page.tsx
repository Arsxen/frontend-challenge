'use client'

import { ActionIcon, Divider, Flex, Grid, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaAngleLeft, FaHeart, FaRegHeart } from 'react-icons/fa6'
import { AppSettings } from 'src/components/app-settings'
import { useCurrentWeather, useWeatherForecast } from 'src/hooks/api'
import { useAppSettings, useFavoritedCities } from 'src/hooks/local-storage'
import { useTemparatureFormatter } from 'src/hooks/temparature-formatter'
import style from './style.module.css'

dayjs.extend(utc)

export default function CityWeather() {
  const params = useParams()
  const cityCode = decodeURIComponent(params.city as string)
  const [favoritedCities, setFavoritedCities] = useFavoritedCities()
  const formatTemp = useTemparatureFormatter()
  const [{ unitOfMeasurement }] = useAppSettings()
  const isfavoritedCities = favoritedCities.includes(cityCode)

  const { data } = useCurrentWeather(cityCode)
  const { data: forecastData } = useWeatherForecast(cityCode)

  if (data == null || forecastData == null) {
    return null
  }

  const offset = data.timezone / 60

  const now = dayjs.utc().utcOffset(offset)

  const addToFavoritedCities = () => {
    setFavoritedCities([...favoritedCities, cityCode])
  }

  const removeFromFavoritedCities = () => {
    setFavoritedCities(favoritedCities.filter((code) => code !== cityCode))
  }

  return (
    <div className={style.container}>
      <div className={style.navbar}>
        <ActionIcon variant="default" size="lg" component={Link} href="/">
          <FaAngleLeft />
        </ActionIcon>
        <AppSettings />
      </div>
      <div className={style.content}>
        <div>
          <Flex justify="space-between">
            <Title order={1}>{data.name}</Title>
            {isfavoritedCities ? (
              <ActionIcon
                variant="transparent"
                color="pink"
                size="sm"
                onClick={removeFromFavoritedCities}
              >
                <FaHeart style={{ width: '100%', height: '100%' }} />
              </ActionIcon>
            ) : (
              <ActionIcon
                variant="transparent"
                color="dark"
                size="sm"
                onClick={addToFavoritedCities}
              >
                <FaRegHeart style={{ width: '100%', height: '100%' }} />
              </ActionIcon>
            )}
          </Flex>

          <Text size="lg">{now.format('dddd DD MMM YYYY, HH:mm')}</Text>
        </div>

        <Flex direction="column" align="center">
          <Image
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt="weather icon"
            width={150}
            height={150}
            unoptimized
          />
          <Title size={40}>{data.weather[0].main}</Title>
          <Text size="lg">{data.weather[0].description}</Text>
          <Text size="md">
            Min:{' '}
            <Text span fw={700}>
              {formatTemp(data.main.temp_min)}
            </Text>{' '}
            - Current:{' '}
            <Text span fw={700}>
              {formatTemp(data.main.temp)}
            </Text>{' '}
            - Max:{' '}
            <Text span fw={700}>
              {formatTemp(data.main.temp_max)}
            </Text>
          </Text>
        </Flex>
        <Divider />
        <Title order={5}>24 Hours Forecast</Title>
        <div className={style['forecast-list']}>
          {forecastData.list.slice(0, 8).map((item) => (
            <div key={item.dt} className={style['forecast-item']}>
              <Text size="sm">
                {dayjs.unix(item.dt).utcOffset(offset).format('HH:mm')}
              </Text>
              <Image
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
                unoptimized
              />
              <Text size="sm" fw={700} span>
                {formatTemp(item.main.temp)}
              </Text>
            </div>
          ))}
        </div>
        <Divider />
        <Title order={5}>Current details</Title>
        <Grid>
          <Grid.Col span={{ lg: 3, base: 6 }}>Humidity</Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>{data.main.humidity}%</Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>Wind speed</Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>
            {data.wind.speed} {unitOfMeasurement === 'imperial' ? 'mph' : 'm/s'}
          </Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>Pressure</Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>
            {data.main.pressure} hPa
          </Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>1h Rain volume</Grid.Col>
          <Grid.Col span={{ lg: 3, base: 6 }}>
            {data.rain != null ? `${data.rain['1h']} mm/h` : '-'}
          </Grid.Col>
        </Grid>
      </div>
    </div>
  )
}
