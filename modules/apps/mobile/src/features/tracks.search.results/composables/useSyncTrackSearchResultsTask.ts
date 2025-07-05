import { watch, Ref } from 'vue'
import { IDatabaseService, IndexService, TracksService } from '@lectorium/dal/index'
import { useTrackSearchResultsStore } from './useTrackSearchResultsStore'
import { TrackSearchFilters } from '../models/TrackSearchFilters'
import { useSearchResultsLoader } from './useSearchResultsLoader'
import { Duration, Source } from '@lectorium/dal/models'

type Options = {
  indexService: IndexService
  tracksService: TracksService
  sourcesService: IDatabaseService<Source>
  durationsService: IDatabaseService<Duration>
  language: Ref<string>
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
    { immediate: false }
  )

  watch(
    () => trackSearchResultsStore.pagesLoaded, 
    async (value: number) => { 
      onLoadedPagesCountChanged(trackSearchResultsStore.filters, value) 
    }
  )

  watch(
    () => options.language.value,
    async () => await onFiltersChanged(trackSearchResultsStore.filters),
  )

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onFiltersChanged(
    filters: TrackSearchFilters
  ) {
    try {
      trackSearchResultsStore.isLoading = true
      const searchResults = await searchResultsLoader.load({ 
        filters, 
        offset: 0, 
        language: options.language.value 
      })
      trackSearchResultsStore.setItems(searchResults, { replace: true })
    } finally {
      trackSearchResultsStore.isLoading = false
    }
  }

  async function onLoadedPagesCountChanged(
    filters: TrackSearchFilters,
    pagesLoaded: number,
  ) {
    try {
      trackSearchResultsStore.isLoading = true
      const searchResults = await searchResultsLoader.load({ 
        filters, 
        offset: pagesLoaded * 25,
        language: options.language.value
      })
      trackSearchResultsStore.setItems(searchResults, { replace: false })
    } finally {
      trackSearchResultsStore.isLoading = false
    }
  }
}