<template>
  <TrackListItem
    v-for="item in searchResultsStore.items"
    :key="item.trackId"
    :track-id="item.trackId"
    :date="item.date"
    :title="item.title"
    :author="item.author"
    :location="item.location"
    :references="item.references"
    :tags="item.tags"
    @click="emit('click', item.trackId)"
  >
    <template #state="{ trackId }">
      <TrackStateIndicator :track-id="trackId" />
    </template>
  </TrackListItem>
  
  <SearchSpecifyCriteria 
    v-if="searchResultsStore.maximumItemsLoaded"
  />

  <IonInfiniteScroll
    v-if="!searchResultsStore.isLastPage"
    @ion-infinite="onInfiniteSctoll"
  >
    <IonInfiniteScrollContent />
  </IonInfiniteScroll>
</template>


<script setup lang="ts">
import { IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue'
import { TrackListItem } from '@lectorium/mobile/features/trackListItem'
import { TrackStateIndicator } from '@lectorium/mobile/features/trackState'
import { useTrackSearchResultsStore } from '../composables/useTrackSearchResultsStore'
import SearchSpecifyCriteria from './SearchSpecifyCriteria.vue'
import { useSearchResultsLoader } from '../composables/useSearchResultsLoader'
import { useDAL } from '@lectorium/mobile/app'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL() // TODO: remove this dep
const searchResultsStore = useTrackSearchResultsStore()
const searchResultsLoader = useSearchResultsLoader({
  sourcesService: dal.sources,
  indexService: dal.index,
  tracksService: dal.tracks
})

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const emit = defineEmits<{
  click: [trackId: string]
}>()

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onInfiniteSctoll(e: InfiniteScrollCustomEvent) {
  if (searchResultsStore.maximumItemsLoaded) {
    e.target.complete()  
    return
  }

  searchResultsLoader.load(
    searchResultsStore.filters,
    searchResultsStore.items.length
  ).then(() => e.target.complete())
}
</script>
