import { IRepository } from '@lectorium/dal/index'
import { useUpdateTrackStateStore, useUpdateTrackStateFromPlaylistStateTask } from '@lectorium/mobile/features/app.tracks.state'
import { Events, Slots } from '../events'
import { MediaItem, PlaylistItem } from '@lectorium/dal/models'

type Options = {
  mediaItemsService: IRepository<MediaItem>,
  playlistItemsService: IRepository<PlaylistItem>,
  events: typeof Events,
  slots: typeof Slots,
}

export async function initTrackStateFeature(
  options: Options
) {
  const updater = useUpdateTrackStateStore({
    mediaItemsService: options.mediaItemsService,
    playlistItemsService: options.playlistItemsService,
  })

  Promise.all([
    updater.setInPlaylistFlag(),
    updater.setIsCompletedFlag(),
    updater.setIsFailedFlagIfMediaItemsFailed(),
    updater.setIsFailedFlagIfNoMediaItemsFound(),
  ])
  
  useUpdateTrackStateFromPlaylistStateTask({
    playlistItemService: options.playlistItemsService
  })
}