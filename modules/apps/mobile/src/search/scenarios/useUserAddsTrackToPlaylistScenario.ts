import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useDAL, useBucketService, useConfig, useMediaService, useIdGenerator } from '@lectorium/mobile/app'
import { S3Operation } from '@lectorium/protocol/index'
import { usePlaylistStore } from '@lectorium/mobile/home/stores/usePlaylistStore'
import { useSearchResultsStore } from '@lectorium/mobile/app/stores/useSearchResultsStore'

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
  const playlistStore = usePlaylistStore()
  const searchResultsStore = useSearchResultsStore()

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
      const trackTitle = track.title[config.appLanguage.value] || track.title['en'] || 'Unknown'

      // Add track to playlist
      await dal.playlistItems.addOne({
        _id: idGenerator.generateId(24),
        trackId: trackId,
        type: 'playlistItem',
        addedAt: Date.now(),
        completedAt: undefined,
        archivedAt: undefined,
      })
      
      // Update user interface to show that track is being added and started downloading
      playlistStore.updateByTrackId(trackId, { progress: 0 })
      searchResultsStore.updateByTrackId(trackId, { progress: 0, added: true })

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
      // Something wrong happened
      playlistStore.updateByTrackId(trackId, { 
        state: 'failed',
        progress: undefined
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    execute,
  }
}