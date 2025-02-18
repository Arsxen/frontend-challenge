import type { NextRequest } from 'next/server'
import { config } from 'src/config'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  const unit = request.nextUrl.searchParams.get('unit') ?? 'standard'

  if (query == null) {
    return Response.json({ message: 'Missing search query' }, { status: 400 })
  }

  const searchParams = new URLSearchParams({
    q: query,
    units: unit,
    appid: config.openWeatherApiKey,
  })

  const response = await fetch(
    `${config.openWeatherApiUrl}/data/2.5/weather?${searchParams.toString()}`,
  )

  if (!response.ok) {
    console.error(await response.json())
    return Response.json(
      { message: 'Failed to fetch locations' },
      { status: 500 },
    )
  }

  return Response.json(await response.json())
}
