<template>
  <Page>
    <PlaylistSection
      @click="onPlaylistItemClicked"
      @delete="playlistItemId => archivePlaylistItem().execute(playlistItemId)"
    />
  </Page>
</template>


<script setup lang="ts">
import { Page } from '@lectorium/mobile/features/app.core'
import { PlaylistSection } from '@lectorium/mobile/features/playlist'
import { archivePlaylistItem } from '@lectorium/mobile/operations'
import { Events } from '@lectorium/mobile/events'

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onPlaylistItemClicked(playlistItemId: string) {
  Events.playTrackRequested.notify({ playlistItemId })
}
</script>