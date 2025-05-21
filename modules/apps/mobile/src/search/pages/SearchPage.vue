<template>
  <Page>
    <Searchbar
      v-model="trackSearchResultsStore.filters.query"
      :placeholder="$t('search.search', { count: tracksCount })"
    />
    <SearchFiltersBar v-model="trackSearchResultsStore.filters" />
    <SearchResultsSection @click="onTrackClicked" />
  </Page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDAL } from '@lectorium/mobile/app/composables/useDAL'
import Page from '@lectorium/mobile/app/components/Page.vue'
import Searchbar from '@lectorium/mobile/search/components/Searchbar.vue'
import SearchFiltersBar from '@lectorium/mobile/search/containers/SearchFiltersBar/SearchFiltersBar.vue'
import { SearchResultsSection, useTrackSearchResultsStore } from '@lectorium/mobile/features/trackSearch' 
import { useUserAddsTrackToPlaylistScenario } from '../scenarios/useUserAddsTrackToPlaylistScenario'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()
const trackSearchResultsStore = useTrackSearchResultsStore()
const userAddsTrackToPlaylistScenario = useUserAddsTrackToPlaylistScenario()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const tracksCount = ref<number>(0)

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  tracksCount.value = await dal.tracks.getCount()
})

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onTrackClicked(trackId: string) {
  userAddsTrackToPlaylistScenario.execute(trackId)
}
</script>
