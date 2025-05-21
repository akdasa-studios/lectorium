<template>
  <TrackListItem
    v-for="item in searchResultsStore.items"
    :key="item.trackId"
    :track-id="item.trackId"
    :date="item.date || ''"
    :title="item.title"
    :author="item.author"
    :location="item.location"
    :references="item.references"
    :tags="item.tags"
    @click="onTrackClicked(item.trackId)"
  >
    <template #state="{ trackId }">
      <TrackStateIndicator :track-id="trackId" />
    </template>
  </TrackListItem>
  
  <SearchSpecifyCriteria 
    v-if="searchResultsStore.items.length >= maxRecords"
  />

  <IonInfiniteScroll
    v-if="scrollEnabled"
    @ion-infinite="onInfiniteSctoll"
  >
    <IonInfiniteScrollContent />
  </IonInfiniteScroll>
</template>


<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue'
import { useSafeOperation, useConfig } from '@lectorium/mobile/app'
import { useUserAddsTrackToPlaylistScenario } from '@lectorium/mobile/search/scenarios/useUserAddsTrackToPlaylistScenario'
import { useUserSearchesForTracksScenario } from '@lectorium/mobile/search/scenarios/useUserSearchesForTracksScenario'
import { mapTrackToSearchResultListItem } from '@lectorium/mobile/home/mappers/tracks'
import { useTrackSearchResultsStore } from '@lectorium/mobile/features/trackSearch'
import { type SearchFilters } from '@lectorium/mobile/search/containers/SearchFiltersBar/SearchFiltersBar.vue'
import SearchSpecifyCriteria from '@lectorium/mobile/search/components/SearchSpecifyCriteria.vue'
import { TrackStateIndicator } from '@lectorium/mobile/features/trackState'
import { TrackListItem } from '@lectorium/mobile/features/trackListItem'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const config = useConfig()
const safeOperation = useSafeOperation()
const searchResultsStore = useTrackSearchResultsStore()
const userSearchesForTracks = useUserSearchesForTracksScenario()
const userAddsTrackToPlaylist = useUserAddsTrackToPlaylistScenario()


/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  filters: SearchFilters
}>()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const maxRecords = 75
const { filters } = toRefs(props)
const scrollEnabled = ref<boolean>(true)

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(filters, async (v) => {
  await loadTracks(0, v)
}, { deep: true, immediate: true })


watch(config.appLanguage, async () => {
  await loadTracks(0, filters.value)
})

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onInfiniteSctoll(e: InfiniteScrollCustomEvent) {
  loadTracks(searchResultsStore.items.length, filters.value)
    .then(() => e.target.complete())
}

async function onTrackClicked(trackId: string) {
  safeOperation.execute({
    operation: async () => await userAddsTrackToPlaylist.execute(trackId),
  })
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

async function loadTracks(
  offset: number = 0,
  filters: SearchFilters,
  pageSize: number = 25,
) {
  // Search for tracks using specified filters
  const searchResult = await userSearchesForTracks
    .execute(offset, filters, pageSize)

  // Map search results to SearchResultListItem
  const items = await Promise.all(
    searchResult.map(
      x => mapTrackToSearchResultListItem(x, config.appLanguage.value)
    )
  )
  // Update the store with the new items. Replace the previous items if offset is 0
  // (it is the first page of results)
  searchResultsStore.setItems(items, { replace: offset === 0 })

  // Allow infinite scroll if there are more items to load
  // (if the last page is full) and the total number of items is 
  // less than maxRecords (loading many items may slow app down)
  scrollEnabled.value = 
    (items.length === pageSize) && 
    (searchResultsStore.items.length < maxRecords)
}
</script>
