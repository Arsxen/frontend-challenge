'use client'

import { Flex, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { NavSearchBar, Navbar } from 'src/components/navbar'
import { useCurrentWeather } from 'src/hooks/api'
import { useFavoritedCities } from 'src/hooks/local-storage'
import { useTemparatureFormatter } from 'src/hooks/temparature-formatter'
import style from './style.module.css'

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

export default function Home() {
  const [favoritedCities] = useFavoritedCities()

  return (
    <>
      <Navbar>
        <NavSearchBar />
      </Navbar>
      {favoritedCities.map((code) => (
        <CityListItem key={code} code={code} />
      ))}
    </>
  )
}
