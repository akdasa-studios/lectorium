import { useLogger } from '@lectorium/mobile/features/app.core'
import { IRepository } from '@lectorium/dal/index'
import { MediaItem, PlaylistItem } from '@lectorium/dal/models'

export type MediaSyncTaskResult = {
  newTrackIds: string[]
}

export type Options = {
  mediaItemsService: IRepository<MediaItem>
  playlistItemsService: IRepository<PlaylistItem>
}

/**
 * Task for synchronizing common data between local and remote db. 
 */
export function useMediaSyncTask(options: Options) {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const logger = useLogger({ module: 'app.services.sync.media' })

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  async function sync(): Promise<MediaSyncTaskResult> {
    try {
      logger.info('Sync started...')
      const result = onSync()
      logger.info('Sync completed successfully')
      return result
    } catch (error) {
      logger.error(`Sync failed: ${JSON.stringify(error)}`)
      return { newTrackIds: [] }
    }
  }
  
  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onSync() {
    const result = []

    // check non archived playlist items for missing media items
    const playlistItems = (await options.playlistItemsService.getMany({ 
      selector: { archivedAt: { $exists: false } },
      limit: 1000 // TODO: paginate
    })).sort((a, b) => a.addedAt - b.addedAt)

    // check media items for playlist items
    for (const item of playlistItems) {
      const mediaItem = await options.mediaItemsService.getMany({
        selector: { trackId: item.trackId }
      })

      // if no media item found, request download
      if (mediaItem.length <= 0) {
        logger.info(`No media item found for trackId: ${item.trackId}, starting download...`)
        result.push(item.trackId)
      }
    }

    return { newTrackIds: result }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { sync }
}