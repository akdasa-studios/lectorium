<template>
  <template
    v-for="item in items"
    :key="item.playlistItemId"
  >
    <WithDeleteAction 
      @delete="emit('delete', item.playlistItemId)"
    >
      <PlaylistItem
        :title="item.title"
        :author="item.author"
        :location="item.location"
        :references="item.references"
        :tags="item.tags"
        :date="item.date"
        :state="item.state"
        :progress="item.progress"
        @click="emit('click', item.playlistItemId)"
      />
    </WithDeleteAction>
  </template>
</template>


<script setup lang="ts">
import PlaylistItem from '@lectorium/mobile/home/components/Playlist/PlaylistItem.vue'
import WithDeleteAction from '@lectorium/mobile/app/components/WithDeleteAction.vue'
import type { 
  PlaylistItemProps, PlaylistItemState, PlaylistItemIdentity 
} from '@lectorium/mobile/home/components/Playlist/PlaylistItem.vue'

defineProps<{
  items: Array<
    & PlaylistItemIdentity 
    & PlaylistItemProps 
    & PlaylistItemState
  >
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'click', id: string): void
}>()
</script>