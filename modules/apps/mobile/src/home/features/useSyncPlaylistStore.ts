import { watch } from 'vue'
import { useConfig } from '@lectorium/mobile/app/composables/useConfig'
import { useDAL } from '@lectorium/mobile/app/composables/useDAL'
import { usePlaylistStore } from '@lectorium/mobile/home/stores/usePlaylistStore'
import { mapPlaylistItem } from '@lectorium/mobile/home/mappers/tracks'


export function useSyncPlaylistStore() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const config = useConfig()
  const playlistStore = usePlaylistStore()

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

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

    // Update the store with the new data
    playlistStore.setItems(vmPlaylistItems) 
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