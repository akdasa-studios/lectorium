import { App } from '@capacitor/app'
import { MediaItem } from '@lectorium/dal/models'
import { ItemChangedEvent } from '@lectorium/dal/services/DatabaseService'
import { useDAL, useDownloaderService } from '@lectorium/mobile/app'
import { useTimeoutPoll } from '@vueuse/core'

export type TrackableMediaItem = {
  mediaItemId: string
  taskId: string
}

export function useSyncMediaItemProgressFeature() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const downloader = useDownloaderService()

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const poll = useTimeoutPoll(pollTrackableMediaItems, 1000, { immediate: true })
  const trackableMediaItems: TrackableMediaItem[] = []
  const terminalStates = ['failed', 'successful']

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  App.addListener('appStateChange', async ({ isActive }) => {
    if (!isActive) { return }
    await onAppActivated()
  })

  dal.mediaItems.subscribe(onMediaItemChanged)

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onAppActivated() {
    const mediaItems = await dal.mediaItems.getInState(['pending', 'running'])
    mediaItems.forEach((item) => { startTracking(item._id, item.taskId) })
  }

  async function onMediaItemChanged(
    event: ItemChangedEvent<MediaItem>
  ) {
    if (event.event === 'added') {
      startTracking(event.item._id, event.item.taskId)
    } if (event.event === 'removed') {
      stopTracking(event.item._id)
    } else if (event.event === 'updated') {
      if (event.item.progress >= 100) {
        stopTracking(event.item._id)
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Helpers                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Polls the downloader service for the status of all trackable media items.
   */
  async function pollTrackableMediaItems() {
    for (const trackableMediaItem of trackableMediaItems) {
      await pollTrackableMediaItem(trackableMediaItem)
    } 
  }

  /**
   * Polls the downloader service for the status of a trackable media item.
   * If the status is in a terminal state, it stops tracking the item. Updates the
   * media item in the database with the current status and progress.
   * @param item The item to track
   */
  async function pollTrackableMediaItem(
    item: TrackableMediaItem
  ) {
    // Get downloader task status
    const status = await downloader.getStatus({
      taskId: item.taskId,
    })

    // Stop tracking if the task is in a terminal state
    if (terminalStates.includes(status.status)) {
      if (status.status === 'failed') {
        console.error('Download failed:', status)
      }
      stopTracking(item.mediaItemId)
    }
    
    // Update the media item with the current status
    await dal.mediaItems.patchOne(
      item.mediaItemId, 
      {
        taskStatus: status.status,
        progress: status.progress,
      }
    )
  }

  /**
   * Starts tracking a media item by adding it to the list of trackable items.
   * If there are trackable items, it starts the polling.
   * @param mediaItemId The ID of the media item to track
   * @param taskId The ID of the downloader task
   */
  function startTracking(mediaItemId: string, taskId: string) {
    console.log('Starting tracking for media item:', mediaItemId)
    const index = trackableMediaItems.findIndex((item) => item.mediaItemId === mediaItemId)
    if (index === -1) {
      trackableMediaItems.push({ mediaItemId, taskId })
    }
    if (trackableMediaItems.length > 0) { poll.resume() }
  }

  /**
   * Stops tracking a media item by removing it from the list of trackable items.
   * @param mediaItemId The ID of the media item to stop tracking
   */
  function stopTracking(mediaItemId: string) {
    console.log('Stopping tracking for media item:', mediaItemId)
    const index = trackableMediaItems.findIndex((item) => item.mediaItemId === mediaItemId)
    if (index !== -1) {
      trackableMediaItems.splice(index, 1)
    }
    if (trackableMediaItems.length <= 0) { poll.pause }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  async function init() {
    await onAppActivated()
  }

  return { init }
}