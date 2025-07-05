import { MediaItemsService, TracksService } from '@lectorium/dal/index'
import { useTrackMediaItems } from '@lectorium/mobile/features/app.tracks.mediaItems'
import { useTrackMediaItemsDownloader } from '@lectorium/mobile/features/app.tracks.mediaItems.downloader'
import { IBucketService } from '../interfaces'
import { useTrackStateStore } from '../features/app.tracks.state'
import { Events } from '../events'
import { useLogger } from '../features/app.core'

type Options = {
  bucketName: string
  bucketService: IBucketService
  tracksService: TracksService
  mediaItemsService: MediaItemsService
  uniqueIdGenerator: () => string
}

export async function initTrackDownloadingFeature(
  options: Options
) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const logger = useLogger({ module: 'app.tracks.downloading' })
  const trackState = useTrackStateStore()
  const trackMediaItems = useTrackMediaItems(options)
  const tracksDownloader = useTrackMediaItemsDownloader({ mediaItemsService: options.mediaItemsService })


  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  Events.trackDownloadRequested.subscribe(async (event) => {
    logger.info(`Track download requested: ${event.trackId}`)

    // Check if the track is already being downloaded
    const downloadingTasks = tracksDownloader.getTasksByTrackId(event.trackId)
    if (downloadingTasks.length > 0) { return }

    // Start downloading the track
    const { trackId } = event
    try { 
      // Create media items for the track and start downloading them
      logger.info(`Creating media items for track: ${trackId}`)
      const mediaItems = await trackMediaItems.createMediaItems(trackId)
      if (mediaItems.length === 0) { return }

      // Update track state to indicate that the download has started
      trackState.setState(trackId, { 
        downloadProgress: 0, 
        isFailed: undefined 
      })

      // Enqueue media items for download
      logger.info(`Enqueuing media items for download: ${mediaItems.length} items`)      
      for (const mediaItem of mediaItems) {
        tracksDownloader.enqueue(mediaItem)
      }
    } catch (error) {
      trackState.setState(trackId, { isFailed: true })
      logger.error(`Failed to download track ${trackId}: `, error)
    }
  })

  tracksDownloader.status.subscribe(async (mediaItem) => {
    const relatedDownloads = tracksDownloader.getTasksByTrackId(mediaItem.trackId)
    const downloadProgress = Math.min(...relatedDownloads.map(x => x.progress || 0))
    trackState.setState(mediaItem.trackId, { downloadProgress })
  })

  tracksDownloader.failed.subscribe(async (mediaItem) => {
    trackState.setState(mediaItem.trackId, { isFailed: true, downloadProgress: undefined })
    logger.error(`Download failed for track ${mediaItem.trackId}: ` + JSON.stringify(mediaItem))
  })
}