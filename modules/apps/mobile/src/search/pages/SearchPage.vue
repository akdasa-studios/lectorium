<template>
  <Page>
    <!-- Search input text -->
    <SearchInput
      v-model="trackSearchResultsStore.filters.query"
      :placeholder="$t('search.search', { count: tracksCountStore.totalCount })"
    />

    <!-- Search filter bar with filter chips -->
    <SearchFiltersBar v-model="trackSearchResultsStore.filters" />

    <!-- Found tracks with state indicator -->
    <SearchResultsSection @click="onTrackClicked">
      <template #state="{ trackId }">
        <TrackStateIndicator :track-id="trackId" />
      </template>
    </SearchResultsSection>
  </Page>
</template>

<script setup lang="ts">
import Page from '@lectorium/mobile/app/components/Page.vue'
import { SearchInput } from '@lectorium/mobile/features/app.core'
import { SearchFiltersBar } from '@lectorium/mobile/features/tracks.search.filters'
import { TrackStateIndicator } from '@lectorium/mobile/features/tracks.state'
import { SearchResultsSection, useTrackSearchResultsStore } from '@lectorium/mobile/features/tracks.search.results' 
import { useTracksCountStore } from '@lectorium/mobile/features/tracks.count'
import { useUserAddsTrackToPlaylistScenario } from '../scenarios/useUserAddsTrackToPlaylistScenario'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const trackSearchResultsStore = useTrackSearchResultsStore()
const userAddsTrackToPlaylistScenario = useUserAddsTrackToPlaylistScenario()
const tracksCountStore = useTracksCountStore()

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onTrackClicked(trackId: string) {
  userAddsTrackToPlaylistScenario.execute(trackId)
}
</script>
