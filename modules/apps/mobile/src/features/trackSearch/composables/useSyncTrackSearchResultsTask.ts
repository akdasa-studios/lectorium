import { watch } from 'vue'
import { IndexService, SourcesService, TracksService } from '@lectorium/dal/index'
import { useTrackSearchResultsStore } from './useTrackSearchResultsStore'
import { TrackSearchFilters } from '../models/TrackSearchFilters'
import { useSearchResultsLoader } from './useSearchResultsLoader'

type Options = {
  sourcesService: SourcesService
  indexService: IndexService
  tracksService: TracksService
}

export function useSyncTrackSearchResultsTask(
  options: Options
) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const searchResultsLoader = useSearchResultsLoader(options)
  const trackSearchResultsStore = useTrackSearchResultsStore()

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  watch(
    trackSearchResultsStore.filters, 
    async (value: TrackSearchFilters) => await onFiltersChanged(value)
  )

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onFiltersChanged(filters: TrackSearchFilters) {
    await searchResultsLoader.load(filters, 0)
  }
}