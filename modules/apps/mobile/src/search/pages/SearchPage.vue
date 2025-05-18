<template>
  <Page>
    <Searchbar
      v-model="filters.query"
      :placeholder="$t('search.search', { count: tracksCount })"
    />
    <SearchFiltersBar v-model="filters" />
    <SearchResultsSection :filters="filters" />
  </Page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDAL } from '@lectorium/mobile/app/composables/useDAL'
import { type SearchFilters } from '@lectorium/mobile/search/containers/SearchFiltersBar/SearchFiltersBar.vue'
import Page from '@lectorium/mobile/app/components/Page.vue'
import Searchbar from '@lectorium/mobile/search/components/Searchbar.vue'
import SearchFiltersBar from '@lectorium/mobile/search/containers/SearchFiltersBar/SearchFiltersBar.vue'
import SearchResultsSection from '@lectorium/mobile/search/containers/SearchResults/SearchResultsSection.vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const defaultFilterValue = {
  query: '',
  ids: [],
  authors: [],
  sources: [],
  locations: [],
  languages: [],
  duration: { min: 0, max: Number.MAX_SAFE_INTEGER },
  dates: { from: '', to: '' },
}

const filters = ref<SearchFilters>(defaultFilterValue)
const tracksCount = ref<number>(0)

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  tracksCount.value = await dal.tracks.getCount()
})
</script>
