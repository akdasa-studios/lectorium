import { MediaItemsService, PlaylistItemsService } from '@lectorium/dal/index'
import { initTrackStateStore, useUpdateTrackStateFromPlaylistStateTask } from '@lectorium/mobile/features/app.tracks.state'
import { Events, Slots } from '../events'

type Options = {
  mediaItemsService: MediaItemsService,
  playlistItemsService: PlaylistItemsService,
  events: typeof Events,
  slots: typeof Slots,
}

export async function initTrackStateFeature(
  options: Options
) {
  await initTrackStateStore({
    mediaItemsService: options.mediaItemsService,
    playlistItemsService: options.playlistItemsService,
  })
  
  useUpdateTrackStateFromPlaylistStateTask({
    playlistItemService: options.playlistItemsService
  })
}