import { useDAL } from './app/composables/useDAL'
import { useLogger } from './app/composables/useLogger'
import { useDownloaderService } from './app/composables/useDownloaderService'
import { useSyncDownloadingStateTask, useSyncPlaylistStateTask, useTracksStateFeature } from './features/tracks.state'

export async function initTrackStateFeature() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const downloader = useDownloaderService()
  const logger = useLogger({ module: 'init:trackStateFeature' })

  /* -------------------------------------------------------------------------- */
  /*                                    Steps                                   */
  /* -------------------------------------------------------------------------- */

  logger.info('Initializing...')

  useSyncDownloadingStateTask({
    getTasks: () => downloader.tasks,
    subscribeTaskStatus: (callback) => { downloader.statusEvent.subscribe(callback) },
    subscribeTaskFailed: (callback) => { downloader.failedEvent.subscribe(callback) },
    subscribeTaskEnqueued: (callback) => { downloader.enqueuedEvent.subscribe(callback) },
  }).start()

  useSyncPlaylistStateTask({
    playlistItemService: dal.playlistItems
  }).start()

  await useTracksStateFeature().init({
    mediaItemsService: dal.mediaItems,
    playlistItemsService: dal.playlistItems,
  })
}