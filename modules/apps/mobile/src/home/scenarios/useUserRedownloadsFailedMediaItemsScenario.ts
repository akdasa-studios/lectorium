import { useDAL, useBucketService, useConfig, useMediaService } from '@lectorium/mobile/app'
import { S3Operation } from '@lectorium/protocol/index'

// TODO: similar to useUserSelectsTrackToPlayScenario.ts
export function useUserRedownloadsFailedMediaItemsScenario() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const config = useConfig()
  const mediaService = useMediaService()
  const bucketService = useBucketService()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function execute(
    playlistItemId: string
  ) {
    const playlistItem = await dal.playlistItems.getOne(playlistItemId)
    const track = await dal.tracks.getOne(playlistItem.trackId)
    const trackTitle = track.title[config.appLanguage.value]
        || track.title['en']
        || track.title[Object.keys(track.title)[0]]
        || 'No title'
  
    const signedUrl = await bucketService.getSignedUrl({
      key: track.audio.original.path,
      bucketName: config.bucketName.value,
      expiresIn: 60 * 60 * 24,
      operation: S3Operation.GetObject,
    })

    // Enqueue related media to download
    // TODO: add support for multiple media items
    await mediaService.get({
      trackId: track._id,
      url: signedUrl.signedUrl, 
      destination: track.audio.original.path,
      title: trackTitle,
    })

    // Download all related transcripts
    // TODO: download only transcript in language of the user selected in settings
    for (const transcript of Object.values(track.transcripts)) {
      const signedUrl = await bucketService.getSignedUrl({
        key: transcript.path,
        bucketName: config.bucketName.value,
        expiresIn: 60 * 60 * 24,
        operation: S3Operation.GetObject,
      })
      await mediaService.get({
        trackId: track._id,
        url: signedUrl.signedUrl, 
        destination: transcript.path,
        title: trackTitle, 
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { execute }
}