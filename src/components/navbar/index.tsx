'use client'

import { ActionIcon, type ComboboxItem, Select } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaGear, FaMagnifyingGlass } from 'react-icons/fa6'
import { queryKey } from 'src/api/query-key'
import { useSearch } from 'src/hooks/api'
import type { SearchResponse } from 'src/types/api'
import { AppSettings } from '../app-settings'
import style from './style.module.css'

export function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  const { data } = useSearch(search)

  const onSearch = useDebouncedCallback((value: string) => {
    router.push(!value ? '/' : `/?search=${encodeURIComponent(value)}`)
  }, 500)

  const onSelect = (_: unknown, option: ComboboxItem) => {
    router.push(`/${encodeURIComponent(option.value)}`)
  }

  const options =
    data?.map((x) => ({
      label: `${x.name}, ${x.country}`,
      value: `${x.name},${x.countryCode}`,
    })) ?? []

  return (
    <div className={style.navbar}>
      <Select
        className={style['search-bar']}
        placeholder="Enter city or zipcode"
        data={options}
        searchable
        defaultSearchValue={search ?? undefined}
        onSearchChange={onSearch}
        onChange={onSelect}
        rightSection={<FaMagnifyingGlass />}
        rightSectionPointerEvents="none"
      />
      <AppSettings />
    </div>
  )
}
