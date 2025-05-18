<template>
  <SearchResultListItem
    v-for="item in items"
    :key="item.trackId"
    :track-id="item.trackId"
    :date="item.date || ''"
    :title="item.title"
    :author="item.author"
    :location="item.location"
    :references="item.references"
    :tags="item.tags"
    :added="item.added"
    :completed="item.completed"
    :progress="item.progress"
    @click="emit('click', item.trackId)"
  />
</template>


<script setup lang="ts">
import SearchResultListItem from '@lectorium/mobile/search/components/SearchResultListItem.vue'
import type { 
  SearchResultListItemProps,
  SearchResultListItemState,
  SearchResultListItemIdentity
} from '@lectorium/mobile/search/components/SearchResultListItem.vue'

defineProps<{
  items: Array<
    & SearchResultListItemProps 
    & SearchResultListItemState
    & SearchResultListItemIdentity>
}>()

const emit = defineEmits<{
  (e: 'click', trackId: string): void
}>()
</script>

