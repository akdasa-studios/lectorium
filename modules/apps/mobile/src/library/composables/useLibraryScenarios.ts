import { createGlobalState } from '@vueuse/core'
import { UserAddsTrackToPlaylistScenario } from '@/library'
import { useDAL, useMediaService } from '@/app'

export const useLibraryScenarios = createGlobalState(() => {
  const dal = useDAL()
  const mediaService = useMediaService()

  return {
    userAddsTrackToPlaylistScenario: 
      new UserAddsTrackToPlaylistScenario(dal.tracks, dal.playlistItems, mediaService),
  }
})