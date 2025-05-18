import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useConfig, useDAL } from '@lectorium/mobile/app'
import { usePlayer, usePlayerControls, usePlayerTranscript } from '@lectorium/mobile/player'
import { Filesystem, Directory } from '@capacitor/filesystem'


export function useUserSelectsTrackToPlayScenario() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const config = useConfig()
  const player = usePlayer()
  const playerControls = usePlayerControls()
  const playerTranscript = usePlayerTranscript()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function execute(playlistItemId: string) {
    // Notify user
    await Haptics.impact({ style: ImpactStyle.Light })
    
    const playlistItem = await dal.playlistItems.getOne(playlistItemId)
    const track = await dal.tracks.getOne(playlistItem.trackId)
    const author = await dal.authors.getOne('author::' + track.author)

    // open track with Audio Player plugin and
    // pass required information for media session widget
    const r = await Filesystem.getUri({
      path: track.audio.original.path, // TODO: use audio type [original, normalized, etc]
      directory: Directory.External,
    })

    await player.open({
      trackId: track._id,
      url: r.uri, 
      title: track.title[config.appLanguage.value]
        || track.title['en']
        || track.title[Object.keys(track.title)[0]],
      author: author.fullName[config.appLanguage.value] 
        || author.fullName['en'] 
        || track.author
    })

    // Start playing the track
    await player.play()

    // Set the trackId in the player controls and transcript
    // whey will update their state accordingly
    playerControls.trackId.value = track._id
    playerControls.playlistItemId.value = playlistItem._id
    playerTranscript.trackId.value = track._id
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    execute
  }
}