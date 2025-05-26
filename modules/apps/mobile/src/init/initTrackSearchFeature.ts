import { useDAL } from '../features/app.database/composables/useDAL'
import { useLogger } from '../features/app.core/composables/useLogger'
import { useSyncTrackSearchResultsTask } from '../features/tracks.search.results'
import { useConfig } from '../features/app.config'

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
    language: useConfig().appLanguage
  })
}