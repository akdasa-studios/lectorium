import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useDAL, useBucketService, useConfig, useMediaService, useIdGenerator } from '@lectorium/mobile/app'
import { S3Operation } from '@lectorium/protocol/index'
import { useTrackStateStore } from '@lectorium/mobile/features/trackState'

/**
 * Scenario for adding a track to a playlist.
 */
export function useUserAddsTrackToPlaylistScenario() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const config = useConfig()
  const idGenerator = useIdGenerator()
  const mediaService = useMediaService()
  const bucketService = useBucketService()
  const trackStateStore = useTrackStateStore()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function execute(
    trackId: string,
  ) {
    try {
      // Add track to playlist: 
      const existingPlayListItem = await dal.playlistItems
        .getMany({ selector: { trackId, archivedAt: { $exists: false } } })
      if (existingPlayListItem.length >= 1) { return }

      // Notify user
      await Haptics.impact({ style: ImpactStyle.Light })

      // Get track information
      const track = await dal.tracks.getOne(trackId)
      const trackTitle = track.title[config.appLanguage.value] 
        || track.title['en'] 
        || track.title[Object.keys(track.title)[0]] 
        || 'No title'
        || 'Unknown'

      // Add track to playlist
      await dal.playlistItems.addOne({
        _id: idGenerator.generateId(24),
        trackId: trackId,
        type: 'playlistItem',
        addedAt: Date.now(),
        completedAt: undefined,
        archivedAt: undefined,
      })
      
      const transcripts = Object.values(track.transcripts)

      // Sign all urls and prepare download tasks for MediaService
      const downloadTasks = await Promise.all(
        [
          // Sign url to download original audio file
          { 
            path: track.audio.original.path,
            title: trackTitle,
          },

          // Sign url to download transcripts
          ...transcripts.map(transcript => ({
            path: transcript.path,
            title: trackTitle, // TODO: add "transcript:" prefix + "(language)" postfix
          }))
        ].map(async (file) => {
          const response = await bucketService.getSignedUrl({
            key: file.path,
            bucketName: config.bucketName.value,
            expiresIn: 60 * 60 * 24,
            operation: S3Operation.GetObject,
          })
          return {
            url: response.signedUrl,
            destination: file.path,
            title: file.title, 
          }
        })
      )

      // Download all files using MediaService and prepared task infos from above
      await Promise.all(
        downloadTasks.map(async (task) => {
          await mediaService.get({ trackId: trackId, ...task })
        })
      )
    } catch {
      trackStateStore.setState(trackId, { isFailed: true })
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    execute,
  }
}