import type { UnitOfMeasurement } from 'src/types/settings'

export const queryKey = {
  search(query: string, unit: UnitOfMeasurement) {
    return ['api', 'search', { q: query, unit }]
  },
  currentWeather(query: string, unit: UnitOfMeasurement) {
    return ['api', 'current-weather', { q: query, unit }]
  },
  forecast(query: string, unit: UnitOfMeasurement) {
    return ['api', 'forecast', { q: query, unit }]
  },
}
