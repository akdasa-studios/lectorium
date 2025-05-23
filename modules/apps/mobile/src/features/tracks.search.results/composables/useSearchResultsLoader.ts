import { Source } from '@lectorium/dal/models/Source'
import { DurationsService, IndexService, SourcesService, TracksService } from '@lectorium/dal/index'
import { TrackSearchFilters } from '../models/TrackSearchFilters'
import { useTrackToSearchResultMapper } from './useTrackToSearchResultMapper'
import { useTrackSearchResultsStore } from './useTrackSearchResultsStore'
import { Duration } from '@lectorium/dal/models'

type Options = {
  sourcesService: SourcesService
  indexService: IndexService
  tracksService: TracksService
  durationsService: DurationsService
}

export function useSearchResultsLoader({
  sourcesService,
  indexService,
  tracksService,
  durationsService,
}:Options) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const trackToSearchResultMapper = useTrackToSearchResultMapper({ language: 'ru' })
  const trackSearchResultsStore  = useTrackSearchResultsStore()

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  async function load(
    filters: TrackSearchFilters,
    offset: number = 0,
    limit: number = 25,
  ) {
    trackSearchResultsStore.isLoading = true

    let duration: Duration | undefined = undefined
    if (filters.duration) {
      duration = await durationsService.findOne({ _id: 'duration::' + filters.duration })
    }

    // TODO: cache sources names
    const sources = await sourcesService.getAll()
    const sourcesNames = sources.reduce(
        (map: Record<string, string>, { _id, shortName }: Source
      ) => {
        Object
          .values(shortName)
          .forEach(translation => map[translation] = _id.replace('source::', ''))
        return map
      }, {})

    const tokens = (filters.query || '').split(' ')
    const translatedTokens = tokens.map(token => {
      const translatedToken = Object.keys(sourcesNames).find(key => key.toLowerCase() === token.toLowerCase())
      return translatedToken ? sourcesNames[translatedToken] : token
    })
    const translatedQuery = translatedTokens.join(' ')

    // Search track IDs using index service    
    const searchQueryTrackIds = translatedQuery
      ? await indexService.search(translatedQuery)
      : { ids: undefined }

    // Perform final search using all filters and ids
    // form the previous step
    const result = await tracksService.find({
      ids: searchQueryTrackIds.ids, 
      authors: filters.authors,
      sources: filters.sources,
      locations: filters.locations,
      languages: filters.languages,
      duration: duration ? { min: duration.minDuration, max: duration.maxDuration } : { min: 0, max: Number.MAX_SAFE_INTEGER },
      dates: filters.dates,
      skip: offset,
      limit: limit,
    })

    const searchResults = await Promise.all(
      result.map(async x => await trackToSearchResultMapper.map(x))
    )
    trackSearchResultsStore.setItems(searchResults, { replace: offset == 0 })
    trackSearchResultsStore.isLoading = false
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { load }
}