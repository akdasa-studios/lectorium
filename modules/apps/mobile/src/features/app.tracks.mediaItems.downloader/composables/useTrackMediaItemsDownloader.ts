import { Filesystem, Directory, ProgressStatus } from '@capacitor/filesystem'
import { MediaItemsService } from '@lectorium/dal/index'
import { MediaItem } from '@lectorium/dal/models'
import { Event, useLogger } from '@lectorium/mobile/features/app.core'

type Options = {
  mediaItemsService: MediaItemsService
}

export type DownloadingMediaItem = MediaItem & {
  progress?: number
}

export function useTrackMediaItemsDownloader(options: Options) {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const logger = useLogger({ module: 'app.tracks.mediaItems.downloader' })

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  Filesystem.addListener('progress', (e) => onProgressUpdate(e))

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */ 

  const tasks: Record<string, DownloadingMediaItem> = {}
  const status = new Event<DownloadingMediaItem>('status')
  const failed = new Event<DownloadingMediaItem>('failed')
  const complete = new Event<DownloadingMediaItem>('complete')

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  function getTasksByTrackId(trackId: string): DownloadingMediaItem[] {
    return Object.values(tasks).filter(task => task.trackId === trackId)
  }

  async function enqueue(mediaItem: MediaItem) {
    tasks[mediaItem.remoteUrl] = { ...mediaItem, progress: 0 }

    // localPath contains file name, so we need to remove 
    // it to get the folder
    const folder = mediaItem.localPath.substring(
      0, mediaItem.localPath.lastIndexOf('/'))

    // NOTE: downloadFile does not create the folder if it does not exist even if
    //       recursive is set to true. So we need to create the folder manually. 
    try {
      await Filesystem.mkdir({
        path: folder,
        directory: Directory.External,
        recursive: true,
      })
    } catch (error: any) {
      if (error.message !== 'Direcory exists') {
        logger.error(`Failed to create folder: ${folder}`, error)
      }
    }
    
    Filesystem.downloadFile({
      url: mediaItem.remoteUrl,
      path: mediaItem.localPath,
      directory: Directory.External,
      recursive: true,
      progress: true,
    }).then(async () => {
      await onDownloadComplete(mediaItem)
    }).catch(async (error) => {
      logger.error(`Failed to download media item`, error)
      await onDownloadFailed(mediaItem)
    })
  }

  function onProgressUpdate(progressStatus: ProgressStatus) {
    const progress = progressStatus.bytes / progressStatus.contentLength * 100
    tasks[progressStatus.url].progress = progress
    status.notify(tasks[progressStatus.url])
  }

  async function onDownloadFailed(mediaItem: MediaItem) {
    await options.mediaItemsService.patchOne(mediaItem._id, { state: 'failed' })
    failed.notify(mediaItem)
    delete tasks[mediaItem.remoteUrl]
  }

  async function onDownloadComplete(mediaItem: MediaItem) {
    await options.mediaItemsService.patchOne(mediaItem._id, { state: 'ready' })
    complete.notify(mediaItem)
    delete tasks[mediaItem.remoteUrl]
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { enqueue, status, complete, failed, getTasksByTrackId }
}