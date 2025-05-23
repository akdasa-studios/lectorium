import { TracksService } from '@lectorium/dal/index'
import { useTracksCountStore } from './useTracksCountStore'

export type Options = {
  tracksService: TracksService
}

export function useTracksCountInitializer({
  tracksService
}: Options) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const tracksCountStore = useTracksCountStore()
  
  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */
  
  async function init() {
    tracksCountStore.totalCount = await tracksService.getCount()
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    init
  }
}