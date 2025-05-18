import { watch } from 'vue'
import { useConfig } from '@lectorium/mobile/app/composables/useConfig'
import { useDAL } from '@lectorium/mobile/app/composables/useDAL'
import { usePlaylistStore } from '@lectorium/mobile/home/stores/usePlaylistStore'
import { mapPlaylistItem } from '@lectorium/mobile/home/mappers/tracks'
import { useDownloaderService } from '@lectorium/mobile/app/composables/useDownloaderService'
import { DownloaderStatusEventArgs, DownloaderTaskEnqueuedEventArgs, DownloaderTaskFailedEventArgs } from '@lectorium/mobile/app/services/DownloaderService'


export function useSyncPlaylistStore() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const config = useConfig()
  const playlistStore = usePlaylistStore()
  const downloaderService = useDownloaderService()

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  downloaderService.statusEvent.subscribe(onDownloaderStatus)
  downloaderService.failedEvent.subscribe(onDownloaderTaskFailed)
  downloaderService.enqueuedEvent.subscribe(onDownloaderTaskEnqueued)

  watch(config.appLanguage, () => { onSync() })
  dal.playlistItems.subscribe(async () => { await onSync() })

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onSync() {
    // Get playlist items from the database
    const dbPlaylistItems = await dal.playlistItems.getMany({
      limit: 25,
      sort: ['addedAt'],
      selector: { 
        type: 'playlistItem', 
        addedAt: { $gte: null },
        archivedAt: { $exists: false },
      },
    })
    
    // Map them to the view model
    const vmPlaylistItems = await Promise.all(
      dbPlaylistItems.map(x => mapPlaylistItem(x, config.appLanguage.value))
    )
    
    // Copy data from the store to the view model
    for (const item of vmPlaylistItems) {
      const p = playlistStore.items.find(x => x.playlistItemId === item.playlistItemId)
      if (p) { item.progress = p.progress }
    }

    // Update the store with the new data
    playlistStore.setItems(vmPlaylistItems)
  }

  function onDownloaderTaskEnqueued(
    event: DownloaderTaskEnqueuedEventArgs
  ) {
    if (!event.meta.trackId) { return }
    playlistStore.updateByTrackId(event.meta.trackId, { progress: 0 })
  }

  function onDownloaderStatus(
    event: DownloaderStatusEventArgs
  ) {
    if (!event.meta.trackId) { return }
    const tasksRelatedToTrack = downloaderService.tasks
      .filter(x => x.meta.trackId === event.meta.trackId)
    const downloadProgress = Math.min(...tasksRelatedToTrack.map(x => x.progress))
    playlistStore.updateByTrackId(event.meta.trackId, { progress: downloadProgress })
  }

  function onDownloaderTaskFailed(
    event: DownloaderTaskFailedEventArgs
  ) {
    if (!event.meta.mediaItemId) { return }
    playlistStore.updateByTrackId(event.meta.trackId, { progress: undefined, state: 'failed' })
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  async function init() {
    await onSync()
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    init
  }
}