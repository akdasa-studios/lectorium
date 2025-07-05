import { useDAL } from '@lectorium/mobile/features/app.database'

export function archivePlaylistItem() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function execute(playlistItemId: string) {
    await dal.archiveService.archiveOne(playlistItemId)
  }
  
  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    execute
  }
}