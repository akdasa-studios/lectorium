import { MediaService } from '@/app'
import { PlaylistItemsService, TracksService } from '@lectorium/dal/index'

export class UserAddsTrackToPlaylistScenario {
  constructor(
    private readonly tracks: TracksService,
    private readonly playlistItems: PlaylistItemsService,
    private readonly media: MediaService,
  ) {}

  async execute(
    trackId: string,
  ) {
    // Add track to playlist, or exit if it already exists
    const existingPlayListItem = await this.playlistItems.findOne({ _id: trackId })
    if (existingPlayListItem) { return }

    // Get track information
    const track = await this.tracks.getOne(trackId)

    // Add track to playlist
    await this.playlistItems.addOne({
      _id: trackId,
      trackId: trackId,
      type: 'playlistItem',
      order: 0,
      played: 0,
    })

    // Enqueue related media to download
    // TODO: add support for multiple media items
    // TODO: get track title in the current language
    // TODO: sign url
    await this.media.get({
      // url: track.audio.original.path,
      trackId: trackId,
      url: 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.avi',
      destination: track.audio.original.path,
      title: track.title.en,
    })
  }

}