export type TomTomSearchResponse = {
  results: {
    address: { municipality: string; country: string; countryCode: string }
  }[]
}
