import { MediaItem } from '@lectorium/dal/models/MediaItem'
import { useTrackStateStore } from './useTrackStateStore'
import { IRepository } from '@lectorium/dal/index'
import { PlaylistItem } from '@lectorium/dal/models'

export type EventArgs = { trackId: string } 
export type EventHandler = (event: EventArgs) => Promise<void>

export type Options = {
  mediaItemsService: IRepository<MediaItem>,
  playlistItemsService: IRepository<PlaylistItem>
}

export function useUpdateTrackStateStore(options: Options) {
  const failedStates: MediaItem['state'][] = ['pending', 'failed']

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const trackStateStore = useTrackStateStore()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function setIsDownloadingFlagFor(trackId: string[]) {
    trackId.forEach(id => {
      trackStateStore.setState(id, { downloadProgress: 0 })
    })
  }

  async function setInPlaylistFlag() {
    // Set inPlaylist for each track
    const activePlaylistItems = await options.playlistItemsService.getMany({ 
      selector: { archivedAt: { $exists: false } },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })
    activePlaylistItems.forEach(item => {
      trackStateStore.setState(item.trackId, { inPlaylist: true })
    })
  }

  async function setIsCompletedFlag() {
    // Get all tracks that are in the completed state
    const completedPlaylistItems = await options.playlistItemsService.getMany({
      selector: {
        completedAt: { $exists: true },
      },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })
    completedPlaylistItems.forEach(item => {
      trackStateStore.setState(item.trackId, { isCompleted: true })
    })
  }

  async function setIsFailedFlagIfMediaItemsFailed() {
    // Get all media items that are in the pending or in failed state
    // and set the download failed status to true for each track
    const failedMediaItems = await options.mediaItemsService.getMany({
      selector: { state: { $in: failedStates } },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })
    const failedTracks = failedMediaItems
      .map(track => track.trackId)
      .filter(id => id !== undefined)
    failedTracks.forEach(trackId => {
      trackStateStore.setState(trackId, { isFailed: true })
    })
  }

  async function setIsFailedFlagIfNoMediaItemsFound() {
    const activePlaylistItems = await options.playlistItemsService.getMany({ 
      selector: { archivedAt: { $exists: false } },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })

    // Check all playlist items and set the download failed status
    // to true for each track that has no media items or has media items
    // in the failed state
    const allRelatedMediaItems = await options.mediaItemsService.getMany({ 
      selector: { trackId: { $in: activePlaylistItems.map(x => x.trackId) } },
      limit: 1000, // TODO: Remove limit when pagination is implemented
    })

    for (const playlistItem of activePlaylistItems) {
      const relatedMediaItems = allRelatedMediaItems.filter(
        x => x.trackId === playlistItem.trackId
      )
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

  return { 
    setInPlaylistFlag,
    setIsCompletedFlag,
    setIsFailedFlagIfMediaItemsFailed,
    setIsFailedFlagIfNoMediaItemsFound,
    setIsDownloadingFlagFor
  }
}