import { MediaItemsService } from '@lectorium/dal/index'
import { DownloaderService, DownloaderTaskStatuses, generateId } from '@/app'

export type GetMediaRequest = {
  trackId: string,
  url: string
  destination: string
  title: string
}

/**
 * MediaService is responsible for managing media items and their download status.
 */
export class MediaService {

  /**
   * Initializes a new instance of the MediaService class.
   * @param mediaItems Media items service
   * @param downloader Downloader service
   */
  constructor(
    private readonly mediaItems: MediaItemsService,
    private readonly downloader: DownloaderService
  ) {
    downloader.onDownloadComplete(
      async ({ taskId, status }) => await this.onMediaItemDownloadComplete(taskId, status) 
    )
  }

  /**
   * Gets media item.
   * @param request Request of getting media item
   */
  async get(
    request: GetMediaRequest
  ): Promise<void> {
    // check if media item already exists
    const mediaItem = await this.mediaItems.findOne({ 
      localPath: request.destination 
    })
    if (mediaItem && mediaItem.taskStatus === 'failed') {
      // Media item failed, remove it and start download again
      await this.mediaItems.removeOne(mediaItem._id)
    } else if (mediaItem) {
      return // Media item already exists, do nothing
    }
      
    // start download
    const downloaderResponse =
      await this.downloader.enqueue(request)
    console.log('Download started:', downloaderResponse.taskId)

    // add to media items
    await this.mediaItems.addOne({
      _id: generateId(22),
      type: 'mediaItem',
      taskStatus: 'pending',
      trackId: request.trackId,
      taskId: downloaderResponse.taskId,
      title: request.title,
      remoteUrl: request.url,
      localPath: request.destination,
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Private                                  */
  /* -------------------------------------------------------------------------- */

  private async onMediaItemDownloadComplete(
    taskId: string,
    status: DownloaderTaskStatuses
  ) {
    // get media item by taskId
    const mediaItem = await this.mediaItems.findOne({ taskId })
    console.log(
      `Download ${taskId} completed with status: `+
      `${mediaItem?.taskStatus ?? 'unknown'} -> ${status}`)

    // update media item status if necessary
    if (mediaItem && mediaItem.taskStatus !== status) {
      mediaItem.taskStatus = status
      await this.mediaItems.updateOne(mediaItem._id, mediaItem)
      console.log('Media item status updated:', mediaItem._id, mediaItem.taskStatus)
    } 
  }
}