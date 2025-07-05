import { MediaItemsService, TracksService } from '@lectorium/dal/index'
import { IBucketService } from '@lectorium/mobile/interfaces'
import { useTrackMediaItemsUrlSigner } from './useTrackMediaItemsUrlSigner'
import { useTrackMediaItemsCreator } from './useTrackMediaItemsCreator'
import { MediaItem } from '@lectorium/dal/models'

type Options = {
  bucketName: string
  bucketService: IBucketService
  tracksService: TracksService
  mediaItemsService: MediaItemsService
  uniqueIdGenerator: () => string
}

export function useTrackMediaItems(options: Options) {
  const trackMediaUrlSigner = useTrackMediaItemsUrlSigner({
    bucketName: options.bucketName,
    bucketService: options.bucketService,
    tracksService: options.tracksService,
  })
  const trackMediaItemCreator = useTrackMediaItemsCreator({
    mediaItemsService: options.mediaItemsService,
    uniqueIdGenerator: options.uniqueIdGenerator,
  })

  async function createMediaItems(
    trackId: string,
  ): Promise<MediaItem[]> {
    const signedMediaUrls = await trackMediaUrlSigner.getTrackSignedMediaUrls(trackId)
    return await trackMediaItemCreator.createMediaItems(trackId, signedMediaUrls)
  }

  return { createMediaItems }
}
