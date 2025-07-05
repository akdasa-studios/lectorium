import { IRepository } from '@lectorium/dal/index'
import { usePlaylistStore } from './usePlaylistStore'
import { usePlaylistItemMapper } from './usePlaylistItemMapper'
import { PlaylistItem, Track } from '@lectorium/dal/models'

export type Options = {
  playlistItemRepo: IRepository<PlaylistItem>
  tracksRepo: IRepository<Track>

}

export function useSyncPlaylistStoreTask(options: Options) {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const mapper = usePlaylistItemMapper()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function sync(language: string) {
    // Get playlist items from the database
    const dbPlaylistItems = await options.playlistItemRepo.getMany({
      limit: 25,
      sort: ['addedAt'],
      selector: { 
        type: 'playlistItem', 
        addedAt: { $gte: null },
        archivedAt: { $exists: false },
      },
    })

    // Get all related tracks in one query to avoid N+1 query problem
    const tracks = await options.tracksRepo.getMany({
      selector: { _id: { $in: dbPlaylistItems.map(item => item.trackId) } },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })
    
    // Map playlist items to the view model
    const vmPlaylistItems = await Promise.all(
      dbPlaylistItems.map(playlistItem => mapper.map({ 
        playlistItem, 
        track: tracks.find(track => track._id === playlistItem.trackId) as Track,
        language: language 
      }))
    )

    // Update the store with the new data
    usePlaylistStore().setItems(vmPlaylistItems) 
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { sync }
}