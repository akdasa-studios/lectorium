import { App } from '@capacitor/app'
import { MediaItem } from '@lectorium/dal/models'
import { DownloaderTaskStatuses, useDAL, useDownloaderService } from '..'

export async function initUpdateMediaItemStatusesOnAppStateChange() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const downloader = useDownloaderService()

  /* -------------------------------------------------------------------------- */
  /*                               Initialization                               */
  /* -------------------------------------------------------------------------- */

  App.addListener('appStateChange', async ({ isActive }) => {
    if (!isActive) { return }
    console.log('App is active, updating media items status...')
    await updateMediaItems()
  })

  updateMediaItems()

  /* -------------------------------------------------------------------------- */
  /*                                   Helpers                                  */
  /* -------------------------------------------------------------------------- */

  async function updateMediaItems() {
    // get all media items which state can be updated
    const mediaItems = await dal.mediaItems
      .getInState(['pending', 'downloading'])

    // get downloader task status for each media item
    // and update media item status if necessary
    for (const mediaItem of mediaItems) {
      // get downloader task status
      const taskStatus = await downloader.getStatus({
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
        console.log(
          `Download ${mediaItem.taskId} completed with status: `+
          `${mediaItem.status} -> ${taskStatus.status}`)
        mediaItem.status = statusesMap[taskStatus.status]
        await dal.mediaItems.updateOne(mediaItem._id, mediaItem)
      }
    }
  }
}