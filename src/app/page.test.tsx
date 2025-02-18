import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { queryKey } from 'src/api/query-key'
import bangkok from '../../mock-data/current-weather/bangkok.json'
import london from '../../mock-data/current-weather/london.json'
import Home from './page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}))

describe('Home page', () => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(
    queryKey.currentWeather('Bangkok,TH', 'standard'),
    bangkok,
  )
  queryClient.setQueryData(
    queryKey.currentWeather('London,GB', 'standard'),
    london,
  )
  localStorage.setItem(
    'favoritedCities',
    JSON.stringify(['Bangkok,TH', 'London,GB']),
  )

  it('should render correctly', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Home />
        </MantineProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Bangkok')).toBeInTheDocument()
    expect(screen.getByText('100 K')).toBeInTheDocument()
    expect(screen.getByText('07:00')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('200 K')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()

    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should go to next page when click on location', async () => {
    const mockedUseRouter = jest.mocked(useRouter)
    const mockedPush = jest.fn()
    const user = userEvent.setup()

    // biome-ignore lint/suspicious/noExplicitAny: For testing
    mockedUseRouter.mockReturnValue({ push: mockedPush } as any)

    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Home />
        </MantineProvider>
      </QueryClientProvider>,
    )

    await user.click(screen.getByText('Bangkok'))

    expect(mockedPush).toHaveBeenCalledWith('/Bangkok,TH')
  })
})
