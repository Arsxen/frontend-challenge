import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryKey } from 'src/api/query-key'
import currentBangkokJson from '../../../mock-data/current-weather/bangkok.json'
import forecastBangkokJson from '../../../mock-data/forecast/bangkok.json'
import CityWeather from './page'

jest.mock('next/navigation', () => ({
  useParams: () => ({ city: 'Bangkok,TH' }),
}))

describe('City page', () => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(
    queryKey.currentWeather('Bangkok,TH', 'standard'),
    currentBangkokJson,
  )
  queryClient.setQueryData(
    queryKey.forecast('Bangkok,TH', 'standard'),
    forecastBangkokJson,
  )

  it('should render correctly', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))

    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <CityWeather />
        </MantineProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Bangkok')).toBeInTheDocument()
    expect(screen.getByText('Wednesday 01 Jan 2025, 07:00')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()

    // Min - Current - Max Temp
    expect(screen.getByText('49 K')).toBeInTheDocument()
    expect(screen.getByText('100 K')).toBeInTheDocument()
    expect(screen.getByText('149 K')).toBeInTheDocument()

    // Forecast
    const forecastTimeAndTemps = [
      { time: '01:00', temp: '10 K' },
      { time: '04:00', temp: '20 K' },
      { time: '07:00', temp: '30 K' },
      { time: '10:00', temp: '40 K' },
      { time: '13:00', temp: '50 K' },
      { time: '16:00', temp: '60 K' },
      { time: '19:00', temp: '70 K' },
      { time: '22:00', temp: '80 K' },
    ]
    for (const { time, temp } of forecastTimeAndTemps) {
      expect(screen.getByText(time)).toBeInTheDocument()
      expect(screen.getByText(temp)).toBeInTheDocument()
    }

    // Humidity, Windspeed, Pressure, Rain
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('10 m/s')).toBeInTheDocument()
    expect(screen.getByText('1000 hPa')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()

    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  })

  it('shold add current location to homepage when click favorite button', async () => {
    localStorage.clear()
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <CityWeather />
        </MantineProvider>
      </QueryClientProvider>,
    )

    await user.click(screen.getByTestId('favorite'))

    expect(localStorage.getItem('favoritedCities')).toEqual(
      JSON.stringify(['Bangkok,TH']),
    )
  })
})
