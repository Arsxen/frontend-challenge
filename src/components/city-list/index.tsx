'use client'

import { Flex, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { queryKey } from 'src/api/query-key'
import { useCurrentWeather } from 'src/hooks/api'
import { useFavoritedCities } from 'src/hooks/local-storage'
import { useTemparatureFormatter } from 'src/hooks/temparature-formatter'
import type { OpenWeatherCurrentWeatherResponse } from 'src/types/openweather'
import style from './style.module.css'

dayjs.extend(utc)

function CityListItem({ code }: { code: string }) {
  const router = useRouter()
  const { data } = useCurrentWeather(code)
  const formatTemp = useTemparatureFormatter()

  if (data == null) {
    return null
  }

  const onClick = () => {
    router.push(`/${code}`)
  }

  return (
    <div
      className={style['city-list-item']}
      onClick={onClick}
      onKeyUp={onClick}
    >
      <div>
        <Title order={3}>{data.name}</Title>
        <Text>{dayjs().utcOffset(data.timezone).format('HH:mm')}</Text>
      </div>
      <Flex align="center">
        <Image
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt="weather icon"
          width={50}
          height={50}
          unoptimized
        />
        <Text>{formatTemp(data.main.temp)}</Text>
      </Flex>
    </div>
  )
}

export function CityList() {
  const [favoritedCities] = useFavoritedCities()

  return favoritedCities.map((code) => <CityListItem key={code} code={code} />)
}
