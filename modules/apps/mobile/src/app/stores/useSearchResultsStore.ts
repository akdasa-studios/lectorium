import { reactive } from 'vue'
import { defineStore } from 'pinia'

type SearchResultItem = {
  trackId: string
  tags: string[]
  date?: string
  title: string
  author?: string
  location?: string
  references: string[]
  progress?: number
  added?: boolean
  completed?: boolean
}

export const useSearchResultsStore = defineStore('search', () =>{
  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const items = reactive<Array<SearchResultItem>>([])

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  function setItems(
    value: SearchResultItem[], 
    options? : { replace?: boolean }
  ) {
    if (options?.replace) { items.length = 0 }
    items.push(...value)
  }

  function getByTrackId(trackId: string) {
    return items.find(item => item.trackId === trackId)
  }

  function updateByTrackId(
    trackId: string, 
    data: Partial<SearchResultItem>
  ) {
    const item = getByTrackId(trackId)
    if (item) {
      Object.assign(item, data)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { items, setItems, getByTrackId, updateByTrackId }
})