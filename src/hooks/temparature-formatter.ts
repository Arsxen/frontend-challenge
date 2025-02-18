import { useCallback } from 'react'
import { useAppSettings } from './local-storage'

export function useTemparatureFormatter() {
  const [{ unitOfMeasurement }] = useAppSettings()

  return useCallback(
    (temp: number) => {
      switch (unitOfMeasurement) {
        case 'standard':
          return `${temp} K`
        case 'metric':
          return `${temp} °C`
        case 'imperial':
          return `${temp} °F`
      }
    },
    [unitOfMeasurement],
  )
}
