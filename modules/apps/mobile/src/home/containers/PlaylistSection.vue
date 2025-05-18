<template>
  <SectionHeader :title="$t('home.upNext')" />
  <Playlist 
    :items="playlistStore.items" 
    @click="onPlaylistItemClick"
    @delete="onPlaylistItemDelete" 
  />
  <PlaylistEmpty
    v-if="playlistStore.items.length === 0"
    @click="goToLibrary"
  />
</template>


<script setup lang="ts">
import { 
  SectionHeader, useUserSelectsTrackToPlayScenario, 
  useUserRemovesPlaylistItemScenario,
  useUserRedownloadsFailedMediaItemsScenario
} from '@lectorium/mobile/home'
import { useRouter } from 'vue-router'
import { usePlaylistStore } from '@lectorium/mobile/app/stores/usePlaylistStore'
import Playlist from '@lectorium/mobile/home/components/Playlist/Playlist.vue'
import PlaylistEmpty from '@lectorium/mobile/home/components/Playlist/PlaylistEmpty.vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const router = useRouter()
const userSelectsTrackToPlay = useUserSelectsTrackToPlayScenario()
const userRemovesPlaylistItem = useUserRemovesPlaylistItemScenario()
// const userRedownloadsFailedMediaItems = useUserRedownloadsFailedMediaItemsScenario()

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const playlistStore = usePlaylistStore()

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onPlaylistItemDelete(playlistItemId: string) {
  await userRemovesPlaylistItem.execute(playlistItemId)
}

function onPlaylistItemClick(playlistItemId: string) {
  // if (!redownload) {
  userSelectsTrackToPlay.execute(playlistItemId)
  // } else {
  //   // userRedownloadsFailedMediaItems.execute(trackId)
  // }
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function goToLibrary() {
  router.replace({ name: 'library' })
}
</script>