import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { queryKey } from 'src/api/query-key'
import { NavSearchBar, Navbar } from '.'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => 'bangkok') })),
}))

describe('Navbar', () => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(queryKey.search('bangkok', 'standard'), [
    { name: 'Bangkok', country: 'Thailand', countryCode: 'TH' },
  ])

  it('should render correctly with data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Navbar>
            <NavSearchBar />
          </Navbar>
        </MantineProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('textbox')).toHaveValue('bangkok')
    expect(screen.getByRole('button')).toBeInTheDocument()
    await expect(
      screen.findByText('Bangkok, Thailand'),
    ).resolves.toBeInTheDocument()
  })

  it('should update search params when input search bar', async () => {
    const mockedUseRouter = jest.mocked(useRouter)
    const mockedPush = jest.fn()
    const user = userEvent.setup()

    // biome-ignore lint/suspicious/noExplicitAny: For testing
    mockedUseRouter.mockReturnValue({ push: mockedPush } as any)

    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Navbar>
            <NavSearchBar />
          </Navbar>
        </MantineProvider>
      </QueryClientProvider>,
    )

    const textbox = screen.getByRole('textbox')
    await user.clear(textbox)
    await user.type(textbox, 'london')

    await waitFor(() =>
      expect(mockedPush).toHaveBeenCalledWith('/?search=london'),
    )
  })
})
