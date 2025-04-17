import { MediaItemsService } from '@lectorium/dal/index'
import { DownloaderService, DownloaderTaskStatuses } from '@/app'
import { MediaItem } from '@lectorium/dal/models'

export type GetMediaRequest = {
  url: string
  destination: string
  title: string
}

/**
 * MediaService is responsible for managing media items and their download status.
 */
export class MediaService {
  constructor(
    private readonly mediaItems: MediaItemsService,
    private readonly downloader: DownloaderService
  ) {
    setInterval(async () => await this.updateMediaItems(), 1000 * 5)
  }

  /**
   * Gets media item.
   * @param request Request of getting media item
   */
  async get(
    request: GetMediaRequest
  ): Promise<void> {
    // TODO: get hash of desrtination and use it as id
    const mediaItemId = request.destination

    // check if media item already exists
    const mediaItem = await this.mediaItems.findOne({ _id: mediaItemId })
    if (mediaItem && mediaItem.status === 'failed') {
      // Media item failed, remove it and start download again
      await this.mediaItems.removeOne(mediaItemId)
    } else if (mediaItem) {
      return // Media item already exists, do nothing
    }
      
    // start download
    const downloaderResponse =
      await this.downloader.enqueue(request)

    // add to media items
    await this.mediaItems.addOne({
      _id: mediaItemId,
      taskId: downloaderResponse.taskId,
      type: 'mediaItem',
      title: request.title,
      remoteUrl: request.url,
      localPath: request.destination,
      status: 'pending',
    })
  }

  /**
   * Updates media items status based on downloader task status.
   */
  private async updateMediaItems() {
    // get all media items which state can be updated
    const mediaItems = await this.mediaItems
      .getInState(['pending', 'downloading'])

    // get downloader task status for each media item
    // and update media item status if necessary
    for (const mediaItem of mediaItems) {
      // get downloader task status
      const taskStatus = await this.downloader.getStatus({
        taskId: mediaItem.taskId
      })

      // maps statuses between downloader service 
      // task status and media item status
      const statusesMap: 
        Record<
          DownloaderTaskStatuses, 
          MediaItem['status']
        > = {
          pending: 'pending',
          running: 'downloading',
          successful: 'available',
          failed: 'failed',
          paused: 'paused'
        }

      // update media item status if necessary
      if (mediaItem.status !== taskStatus.status) {
        mediaItem.status = statusesMap[taskStatus.status]
        await this.mediaItems.updateOne(mediaItem._id, mediaItem)
      }
    }
  }
}