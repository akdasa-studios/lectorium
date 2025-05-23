import { useDAL } from './app/composables/useDAL'
import { useLogger } from './app/composables/useLogger'
import { useSyncTrackSearchResultsTask } from './features/tracks.search.results'

export async function initTrackSearchFeature() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const logger = useLogger({ module: 'init:initTrackSearchFeature' })

  /* -------------------------------------------------------------------------- */
  /*                                    Steps                                   */
  /* -------------------------------------------------------------------------- */

  logger.info('Initializing...')

  useSyncTrackSearchResultsTask({
    indexService: dal.index,
    tracksService: dal.tracks,
    sourcesService: dal.sources,
    durationsService: dal.durations,
  })
}