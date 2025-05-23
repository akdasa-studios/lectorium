<template>
  <template
    v-for="item in playlistStore.items"
    :key="item.playlistItemId"
  >
    <WithDeleteAction 
      @delete="onPlaylistItemDelete(item.playlistItemId)" 
    >
      <TrackListItem
        :track-id="item.trackId"
        :title="item.title"
        :author="item.author"
        :location="item.location"
        :references="item.references"
        :tags="item.tags"
        :date="item.date"
        @click="onPlaylistItemClick"
      >
        <template #state="{ trackId }">
          <TrackStateIndicator 
            :track-id="trackId"
            :ignore-states="['added']"
          />
        </template>
      </TrackListItem>
    </WithDeleteAction>
  </template>
</template>


<script setup lang="ts">
import { TrackListItem } from '@lectorium/mobile/features/tracks.view'
import { TrackStateIndicator } from '@lectorium/mobile/features/tracks.state'
import { PlaylistStoreItem, usePlaylistStore } from '../stores/usePlaylistStore'
import WithDeleteAction from '@lectorium/mobile/app/components/WithDeleteAction.vue'
import { useUserSelectsTrackToPlayScenario } from '../scenarios/useUserSelectsTrackToPlayScenario'
import { useUserRemovesPlaylistItemScenario } from '../scenarios/useUserRemovesPlaylistItemScenario'
import { useUserRedownloadsFailedMediaItemsScenario } from '../scenarios/useUserRedownloadsFailedMediaItemsScenario'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const playlistStore = usePlaylistStore()
const userSelectsTrackToPlay = useUserSelectsTrackToPlayScenario()
const userRemovesPlaylistItem = useUserRemovesPlaylistItemScenario()
const userRedownloadsFailedMediaItems = useUserRedownloadsFailedMediaItemsScenario()

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onPlaylistItemClick(
  item: PlaylistStoreItem
) {
  // if (!item.failed) {
    userSelectsTrackToPlay.execute(item.playlistItemId)
  // } else {
  //   userRedownloadsFailedMediaItems.execute(item.playlistItemId)
//   }
}

async function onPlaylistItemDelete(playlistItemId: string) {
  await userRemovesPlaylistItem.execute(playlistItemId)
}

</script>