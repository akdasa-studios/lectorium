<template>
  <SectionHeader :title="$t('home.upNext')" />
  <Playlist v-if="!playlistStore.isEmpty()" />
  <PlaylistEmpty
    v-else
    @click="goToLibrary"
  />
</template>


<script setup lang="ts">
import { SectionHeader } from '@lectorium/mobile/home'
import { useRouter } from 'vue-router'
import { usePlaylistStore } from '@lectorium/mobile/home/stores/usePlaylistStore'
import Playlist from '@lectorium/mobile/home/containers/Playlist.vue'
import PlaylistEmpty from '@lectorium/mobile/home/components/Playlist/PlaylistEmpty.vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const router = useRouter()

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const playlistStore = usePlaylistStore()


/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function goToLibrary() {
  router.replace({ name: 'library' })
}
</script>