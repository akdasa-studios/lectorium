import { Filesystem, Directory, ProgressStatus } from '@capacitor/filesystem'
import { IRepository } from '@lectorium/dal/index'
import { MediaItem } from '@lectorium/dal/models'
import { Event, useLogger } from '@lectorium/mobile/features/app.core'

type Options = {
  mediaItemsService: IRepository<MediaItem>
  maxConcurrentDownloads?: number
}

export type DownloadingMediaItem = MediaItem & {
  progress?: number
}

export function useTrackMediaItemsDownloader(options: Options) {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const logger = useLogger({ module: 'app.tracks.mediaItems.downloader' })
  const maxConcurrentDownloads = options.maxConcurrentDownloads || 3

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  Filesystem.addListener('progress', (e) => onProgressUpdate(e))

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */ 

  const tasks: Record<string, DownloadingMediaItem> = {}
  const queue: MediaItem[] = []
  const activeDownloads = new Set<string>()
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
    queue.push(mediaItem)
    await processQueue()
  }

  async function processQueue() {
    // If we're at max capacity or queue is empty, return
    if (activeDownloads.size >= maxConcurrentDownloads || queue.length === 0) {
      return
    }

    // Get the next item from queue
    const mediaItem = queue.shift()
    if (!mediaItem) return

    // Add to active downloads
    activeDownloads.add(mediaItem.remoteUrl)

    // Start the download
    await startDownload(mediaItem)

    // Try to process more items from queue
    await processQueue()
  }

  async function startDownload(mediaItem: MediaItem) {
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
    if (tasks[progressStatus.url]) {
      tasks[progressStatus.url].progress = progress
      status.notify(tasks[progressStatus.url])
    }
  }

  async function onDownloadFailed(mediaItem: MediaItem) {
    await options.mediaItemsService.patchOne(mediaItem._id, { state: 'failed' })
    failed.notify(mediaItem)
    
    // Remove from active downloads and tasks
    activeDownloads.delete(mediaItem.remoteUrl)
    delete tasks[mediaItem.remoteUrl]
    
    // Process next item in queue
    await processQueue()
  }

  async function onDownloadComplete(mediaItem: MediaItem) {
    await options.mediaItemsService.patchOne(mediaItem._id, { state: 'ready' })
    complete.notify(mediaItem)
    
    // Remove from active downloads and tasks
    activeDownloads.delete(mediaItem.remoteUrl)
    delete tasks[mediaItem.remoteUrl]
    
    // Process next item in queue
    await processQueue()
  }

  function getQueueStatus() {
    return {
      queued: queue.length,
      active: activeDownloads.size,
      total: Object.keys(tasks).length
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { 
    enqueue, 
    status, 
    complete, 
    failed, 
    getTasksByTrackId,
    getQueueStatus 
  }
}