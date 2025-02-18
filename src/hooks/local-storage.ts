import { useLocalStorage } from '@mantine/hooks'
import type { Settings } from 'src/types/settings'

export function useAppSettings() {
  return useLocalStorage<Settings>({
    key: 'settings',
    defaultValue: { unitOfMeasurement: 'standard' },
    getInitialValueInEffect: false,
  })
}

export function useFavoritedCities() {
  return useLocalStorage<string[]>({
    key: 'favoritedCities',
    defaultValue: [],
    getInitialValueInEffect: false,
  })
}
