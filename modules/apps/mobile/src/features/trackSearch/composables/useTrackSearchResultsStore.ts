import { reactive, computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { TrackSearchFilters } from '../models/TrackSearchFilters'
import { TrackSearchResultItem } from '../models/TrackSearchResultItem'

export const useTrackSearchResultsStore = defineStore('trackSearchResults', () =>{
  
  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const filters = reactive<TrackSearchFilters>({
    query: '', authors: [], sources: [], locations: [], languages: [],
    duration: { min: 0, max: Number.MAX_SAFE_INTEGER },
    dates: { from: '', to: '' }
  })
  const items = reactive<Array<TrackSearchResultItem>>([])
  const isLastPage = ref(false)

  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  const maximumItemsLoaded = computed(() => items.length > 75)

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  function setItems(
    value: TrackSearchResultItem[], 
    options? : { replace?: boolean }
  ) {
    if (options?.replace) { items.length = 0 }
    items.push(...value)
    isLastPage.value = value.length < 25
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { items, filters, setItems, maximumItemsLoaded, isLastPage }
})