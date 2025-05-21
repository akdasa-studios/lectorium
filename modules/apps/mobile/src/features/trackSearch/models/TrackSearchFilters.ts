export type TrackSearchFilters = {
  ids?: string[]
  query: string
  authors: string[]
  sources: string[]
  locations: string[]
  languages: string[]
  duration: { min: number, max: number }
  dates: { from: string, to: string }
}