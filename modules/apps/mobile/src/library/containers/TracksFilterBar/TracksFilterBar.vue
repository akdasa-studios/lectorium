<template>
  <TracksFilterChipsList>
    <AuthorsTracksFilterChip v-model="value.authors" />
    <SourcesTracksFilterChip v-model="value.sources" />
    <LocationsTracksFilterChip v-model="value.locations" />
    <LanguagesTracksFilterChip v-model="value.languages" />
    <DurationsTracksFilterChip v-model="value.durations" />
    <DateRangeTracksFilterChip v-model="value.dates" />
  </TracksFilterChipsList>
</template>


<script lang="ts" setup>
import { TracksFilterChipsList } from '@/library'
import AuthorsTracksFilterChip from './Chips/AuthorsTracksFilterChip.vue'
import SourcesTracksFilterChip from './Chips/SourcesTracksFilterChip.vue'
import LocationsTracksFilterChip from './Chips/LocationsTracksFilterChip.vue'
import LanguagesTracksFilterChip from './Chips/LanguagesTracksFilterChip.vue'
import DurationsTracksFilterChip from './Chips/DurationsTracksFilterChip.vue'
import DateRangeTracksFilterChip from './Chips/DateRangeTracksFilterChip.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

export type TracksFilterValue = {
  ids?: string[]
  authors: string[]
  sources: string[]
  locations: string[]
  languages: string[]
  durations: { min: number, max: number}[]
  dates: { from: string, to: string }
}

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const value = defineModel<TracksFilterValue>({ required: true })
</script>