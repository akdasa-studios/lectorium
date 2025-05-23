import { useDAL } from '@lectorium/mobile/app'
import { Source } from '@lectorium/dal/models'
import { type SearchFilters } from '@lectorium/mobile/search/containers/SearchFiltersBar/SearchFiltersBar.vue'

export function useUserSearchesForTracksScenario() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function execute(
    offset: number = 0,
    filters: SearchFilters,
    pageSize: number,
  ) {
    try {
      // TODO: it will return first 25 records only
      const sources = await dal.sources.getAll()
      const sourcesNames = sources.reduce((map: Record<string, string>, { _id, shortName }: Source) => {
        Object
          .values(shortName)
          .forEach(translation => map[translation] = _id.replace('source::', ''))
        return map
      }, {})
  
      const tokens = filters.query.split(' ')
      const translatedTokens = tokens.map(token => {
        const translatedToken = Object.keys(sourcesNames).find(key => key.toLowerCase() === token.toLowerCase())
        return translatedToken ? sourcesNames[translatedToken] : token
      })
      const translatedQuery = translatedTokens.join(' ')
  
      // Search track IDs using index service    
      const searchQueryTrackIds = translatedQuery
        ? await dal.index.search(translatedQuery)
        : { ids: undefined }
  
      // Perform final search using all filters and ids
      // form the previous step
      return await dal.tracks.find({
        ids: searchQueryTrackIds.ids, 
        authors: filters.authors,
        sources: filters.sources,
        locations: filters.locations,
        languages: filters.languages,
        duration: filters.duration,
        dates: filters.dates,
        skip: offset,
        limit: pageSize,
      })

    } catch (error) {
      // TODO: better error handling
      console.error('Error searching tracks:', error)
      return []
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    execute,
  }
}