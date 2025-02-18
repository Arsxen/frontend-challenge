import type { NextRequest } from 'next/server'
import { config } from 'src/config'
import type { SearchResponse } from 'src/types/api'
import type { OpenWeatherCurrentWeatherResponse } from 'src/types/openweather'
import type { TomTomSearchResponse } from 'src/types/tomtom'
import { uniqBy } from 'src/utils'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (query == null) {
    return Response.json({ message: 'Missing search query' }, { status: 400 })
  }

  const isZipcode = /^\d+$/g.test(query)

  if (isZipcode) {
    // When search with zipcode, use openweather api directly. However, it will allow only zipcode in thailand.
    const searchParams = new URLSearchParams({
      zip: `${query},TH`,
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

    const data: OpenWeatherCurrentWeatherResponse = await response.json()

    const responseBody: SearchResponse = [
      { name: data.name, country: 'Thailand', countryCode: data.sys.country },
    ]

    return Response.json(responseBody)
  }

  // When search with city name, use tomtom search api.
  const searchParams = new URLSearchParams({
    // Bangkok lat/lon to favor locations in thailand
    lat: '13.736717',
    lon: '100.523186',
    language: 'en-US',
    limit: '5',
    entityTypeSet: 'Municipality',
    key: config.tomTomApiKey,
  })

  const response = await fetch(
    `${config.tomTomApiUrl}/search/2/search/${encodeURIComponent(query)}.json?${searchParams.toString()}`,
  )

  if (!response.ok) {
    console.error(await response.json())
    return Response.json(
      { message: 'Failed to fetch locations' },
      { status: 500 },
    )
  }

  const data: TomTomSearchResponse = await response.json()

  const responseBody: SearchResponse = data.results.map((result) => ({
    name: result.address.municipality,
    country: result.address.country,
    countryCode: result.address.countryCode,
  }))

  const uniqueResponse = uniqBy(
    responseBody,
    (x) => `${x.name},${x.countryCode}`,
  )

  return Response.json(uniqueResponse)
}
