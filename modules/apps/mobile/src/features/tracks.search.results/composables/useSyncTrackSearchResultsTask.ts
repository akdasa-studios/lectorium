import { watch } from 'vue'
import { DurationsService, IndexService, SourcesService, TracksService } from '@lectorium/dal/index'
import { useTrackSearchResultsStore } from './useTrackSearchResultsStore'
import { TrackSearchFilters } from '../models/TrackSearchFilters'
import { useSearchResultsLoader } from './useSearchResultsLoader'

type Options = {
  sourcesService: SourcesService
  indexService: IndexService
  tracksService: TracksService
  durationsService: DurationsService
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
    async (value: TrackSearchFilters) => await onFiltersChanged(value),
    { immediate: true }
  )

  watch(
    () => trackSearchResultsStore.pagesLoaded, 
    async (value: number) => { 
      onLoadedPagesCountChanged(trackSearchResultsStore.filters, value) 
    }
  )

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onFiltersChanged(
    filters: TrackSearchFilters
  ) {
    await searchResultsLoader.load(filters, 0)
  }

  async function onLoadedPagesCountChanged(
    filters: TrackSearchFilters,
    pagesLoaded: number,
  ) {
    await searchResultsLoader.load(
      filters, 
      pagesLoaded * 25)
  }
}