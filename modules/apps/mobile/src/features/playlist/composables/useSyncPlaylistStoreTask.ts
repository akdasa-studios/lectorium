import { PlaylistItemsService } from '@lectorium/dal/index'
import { usePlaylistStore } from './usePlaylistStore'
import { usePlaylistItemMapper } from './usePlaylistItemMapper'

export type Options = {
  playlistItemService: PlaylistItemsService
}

export function useSyncPlaylistStoreTask({
  playlistItemService
}: Options) {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const mapper = usePlaylistItemMapper({
    language: 'en' // TODO: use locale
  })

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onSync() {
    // Get playlist items from the database
    const dbPlaylistItems = await playlistItemService.getMany({
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
      dbPlaylistItems.map(x => mapper.map(x)) // TODO: use locale
    )

    // Update the store with the new data
    usePlaylistStore().setItems(vmPlaylistItems) 
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  async function start() {
    playlistItemService.subscribe(async () => { await onSync() })
    await onSync()
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    start  }
}