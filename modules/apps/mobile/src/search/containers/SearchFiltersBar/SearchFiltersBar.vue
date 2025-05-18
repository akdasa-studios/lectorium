<template>
  <SearchFilterChipsList>
    <AuthorsTracksFilterChip v-model="value.authors" />
    <SourcesTracksFilterChip v-model="value.sources" />
    <LocationsTracksFilterChip v-model="value.locations" />
    <LanguagesTracksFilterChip v-model="value.languages" />
    <DurationTracksFilterChip v-model="value.duration" />
    <DateRangeTracksFilterChip v-model="value.dates" />
  </SearchFilterChipsList>
</template>


<script lang="ts" setup>
import SearchFilterChipsList from '@lectorium/mobile/search/components/SearchFilterChipsList.vue'
import AuthorsTracksFilterChip from './Chips/AuthorsTracksFilterChip.vue'
import SourcesTracksFilterChip from './Chips/SourcesTracksFilterChip.vue'
import LocationsTracksFilterChip from './Chips/LocationsTracksFilterChip.vue'
import LanguagesTracksFilterChip from './Chips/LanguagesTracksFilterChip.vue'
import DurationTracksFilterChip from './Chips/DurationTracksFilterChip.vue'
import DateRangeTracksFilterChip from './Chips/DateRangeTracksFilterChip.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

export type SearchFilters = {
  query: string
  ids?: string[]
  authors: string[]
  sources: string[]
  locations: string[]
  languages: string[]
  duration: { min: number, max: number }
  dates: { from: string, to: string }
}

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const value = defineModel<SearchFilters>({ required: true })
</script>