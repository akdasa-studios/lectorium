import { MediaItemsService } from '@lectorium/dal/index'
import { TrackMediaSignedUrl } from '../models/TrackMediaSignedUrl'
import { MediaItem } from '@lectorium/dal/models'

type Options = {
  mediaItemsService: MediaItemsService
  uniqueIdGenerator: () => string
}

export function useTrackMediaItemsCreator(options: Options) {
  const { mediaItemsService, uniqueIdGenerator } = options

  /**
   * Downloads media files for a track.
   * @param trackId ID of the track to download media for
   * @param media Media files to download, signed URLs and paths
   */
  async function createMediaItems(
    trackId: string, 
    media: TrackMediaSignedUrl[]
  ): Promise<MediaItem[]> {
    const result: MediaItem[] = []
    
    // Download all files using MediaService and prepared task infos from above
    for (const task of media) {
      const mediaItem = await mediaItemsService.findOne({ 
        localPath: task.path,
      })
      if (mediaItem && ['failed', 'pending'].includes(mediaItem.state)) {
        // Media item failed, remove it and start download again
        await mediaItemsService.removeOne(mediaItem._id)
      } else if (mediaItem) {
        // Media item already exists and is ready, skip download
        continue
      }
        
      // add to media items
      const newMediaItem = {
        _id: uniqueIdGenerator(), 
        type: 'mediaItem',
        remoteUrl: task.url,
        localPath: task.path,
        trackId: trackId,
        state: 'pending'
      } as MediaItem
      await options.mediaItemsService.addOne(newMediaItem)
      result.push(newMediaItem)
    }

    return result
  }

  return { createMediaItems }
}
