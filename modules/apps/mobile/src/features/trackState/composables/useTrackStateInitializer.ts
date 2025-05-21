import { MediaItem } from '@lectorium/dal/models/MediaItem'
import { useTrackStateStore } from './useTrackStateStore'
import { MediaItemsService, PlaylistItemsService } from '@lectorium/dal/index'

export type EventArgs = { trackId: string } 
export type EventHandler = (event: EventArgs) => Promise<void>

export type Options = {
  mediaItemsService: MediaItemsService
  playlistItemsService: PlaylistItemsService
}

export function useTrackStateInitializer(
  options: Options
) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const trackStateStore = useTrackStateStore()
  const mediaItems = options.mediaItemsService
  const playlistItems = options.playlistItemsService

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function init() {
    const failedStates: MediaItem['state'][] = ['pending', 'failed']

    // Get all media items that are in the pending or in failed state
    // and set the download failed status to true for each track
    const failedMediaItems = await mediaItems.getInState(failedStates)
    const failedTracks = failedMediaItems
      .map(track => track.trackId)
      .filter(id => id !== undefined)
    failedTracks.forEach(trackId => {
      trackStateStore.setState(trackId, { isFailed: true })
    })

    // Set inPlaylist for each track
    const activePlaylistItems = await playlistItems.getMany({ 
      selector: { archivedAt: { $exists: false } } 
    })
    activePlaylistItems.forEach(item => {
      trackStateStore.setState(item.trackId, { inPlaylist: true })
    })

    // Check all playlist items and set the download failed status
    // to true for each track that has no media items or has media items
    // in the failed state
    for (const playlistItem of activePlaylistItems) {
      const relatedMediaItems = await mediaItems.getMany({ 
        selector: { trackId: playlistItem.trackId } 
      })

      const mediaItemsEmpty = relatedMediaItems.length === 0
      const mediaItemsFailed = relatedMediaItems.some(
        x => failedStates.includes(x.state)
      )

      if (mediaItemsEmpty || mediaItemsFailed) {
        trackStateStore.setState(playlistItem.trackId, { isFailed: true })
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { init }
}