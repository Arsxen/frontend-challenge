'use client'

import { ActionIcon, Autocomplete } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { FaAngleLeft, FaMagnifyingGlass } from 'react-icons/fa6'
import { useSearch } from 'src/hooks/api'
import { AppSettings } from '../app-settings'
import style from './style.module.css'

export function NavBackButton() {
  return (
    <ActionIcon variant="default" size="lg" component={Link} href="/">
      <FaAngleLeft />
    </ActionIcon>
  )
}

export function NavSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? undefined

  const { data } = useSearch(search)

  const onSearch = useDebouncedCallback((value: string) => {
    router.push(!value ? '/' : `/?search=${encodeURIComponent(value)}`)
  }, 500)

  const onSubmit = (value: string) => {
    router.push(`/${encodeURIComponent(value)}`)
  }

  const options =
    data?.map((x) => ({
      label: `${x.name}, ${x.country}`,
      value: `${x.name},${x.countryCode}`,
    })) ?? []

  return (
    <Autocomplete
      className={style['search-bar']}
      placeholder="Enter city or zipcode"
      defaultValue={search}
      data={options}
      onChange={onSearch}
      rightSection={<FaMagnifyingGlass />}
      rightSectionPointerEvents="none"
      onOptionSubmit={onSubmit}
      filter={({ options }) => options}
    />
  )
}

export function Navbar({ children }: PropsWithChildren) {
  return (
    <div className={style.navbar}>
      {children}
      <AppSettings />
    </div>
  )
}
