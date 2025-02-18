import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKey } from 'src/api/query-key'
import type { SearchResponse } from 'src/types/api'
import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from 'src/types/openweather'
import { useAppSettings } from './local-storage'

export function useSearch(search: string | null) {
  const [{ unitOfMeasurement }] = useAppSettings()
  return useQuery<SearchResponse>({
    queryKey: queryKey.search(search ?? '', unitOfMeasurement),
    enabled: search != null,
  })
}

export function useCurrentWeather(code: string) {
  const [{ unitOfMeasurement }] = useAppSettings()
  return useQuery<OpenWeatherCurrentWeatherResponse>({
    queryKey: queryKey.currentWeather(code, unitOfMeasurement),
    placeholderData: keepPreviousData,
  })
}

export function useWeatherForecast(code: string) {
  const [{ unitOfMeasurement }] = useAppSettings()
  return useQuery<OpenWeatherForecastResponse>({
    queryKey: queryKey.forecast(code, unitOfMeasurement),
    placeholderData: keepPreviousData,
  })
}
