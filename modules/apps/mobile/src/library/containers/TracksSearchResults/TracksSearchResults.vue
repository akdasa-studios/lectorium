<template>
  <IonList>
    <TracksListItem
      v-for="item in tracks"
      :key="item.trackId"
      :track-id="item.trackId"
      :title="item.title"
      :author="item.author"
      :location="item.location"
      :references="item.references"
      :status="item.status"
      :date="item.date"
      @click="onTrackClick(item.trackId)"
    />
  </IonList>

  <IonInfiniteScroll
    :disabled="!infiniteScrollEnabled"
    @ion-infinite="onInfiniteSctoll"
  >
    <IonInfiniteScrollContent />
  </IonInfiniteScroll>
</template>

<script setup lang="ts">
import { useDAL, TracksListItem, TracksListItemData, useSafeOperation } from '@/app'
import { mapTrackToPlaylistItem } from '@/home'
import { useLibraryScenarios } from '@/library/composables/useLibraryScenarios'
import { IonList, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue'
import { watchDebounced } from '@vueuse/core'
import { ref, toRefs, onMounted } from 'vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()
const libraryScenarios = useLibraryScenarios()
const safeOperation = useSafeOperation()

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

type Filters = {
  authors: string[]
  sources: string[]
  locations: string[]
  languages: string[]
  duration: { min: number; max: number }
  dates: { from: string; to: string }
}

const props = defineProps<{
  filters: Filters
}>()

const { filters } = toRefs(props)


/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const pageSize = 25
const tracks = ref<TracksListItemData[]>([])
const isLoading = ref<boolean>(false)
const infiniteScrollEnabled = ref<boolean>(true)


/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watchDebounced(filters, async (v) => {
  await loadTracks(0, v)
}, { debounce: 500, maxWait: 1000, deep: true })

onMounted(async () => {
  await loadTracks(0, filters.value)
})


/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onInfiniteSctoll(e: InfiniteScrollCustomEvent) {
  await loadTracks(tracks.value.length, filters.value)
  e.target.complete()
}

async function onTrackClick(trackId: string) {
  safeOperation.execute(
    async () => await libraryScenarios.userAddsTrackToPlaylistScenario.execute(trackId)
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

// TODO: extract to Library Scenarios: UserSearchesForTracksScenario
async function loadTracks(
  offset: number = 0,
  filters: Filters,
) {

  try {
    isLoading.value = true
    const searchResult = await dal.tracks.find({
      authors: filters.authors,
      sources: filters.sources,
      locations: filters.locations,
      languages: filters.languages,
      duration: filters.duration,
      dates: filters.dates,
      skip: offset,
      limit: pageSize,
    })
    const items = await Promise.all(searchResult.map(mapTrackToPlaylistItem))
    if (offset === 0) { tracks.value = [] }
    tracks.value.push(...items)
    infiniteScrollEnabled.value = items.length === pageSize 
  } catch (error) {
    // TODO: better error handling
    console.error('Error fetching track suggestions:', error)
    return []
  } finally {
    isLoading.value = false
  }
}
</script>