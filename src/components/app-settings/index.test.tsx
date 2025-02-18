import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppSettings } from '.'

describe('AppSettings', () => {
  it('should render correctly', async () => {
    const user = userEvent.setup()

    render(
      <MantineProvider>
        <AppSettings />
      </MantineProvider>,
    )

    const button = screen.getByRole('button')

    await user.click(button)

    expect(button).toBeInTheDocument()
    await expect(
      screen.findByRole('textbox', { name: /unit of measurement/i }),
    ).resolves.toHaveValue('Standard')
  })

  it('should save selected unit', async () => {
    const user = userEvent.setup()

    render(
      <MantineProvider>
        <AppSettings />
      </MantineProvider>,
    )

    await user.click(screen.getByRole('button'))
    await user.click(
      await screen.findByRole('textbox', { name: /unit of measurement/i }),
    )
    await user.click(screen.getByRole('option', { name: /metric/i }))

    expect(localStorage.getItem('settings')).toEqual(
      JSON.stringify({ unitOfMeasurement: 'metric' }),
    )
  })
})
