<template>
  <SearchFilterChipWithDateRange 
    v-model="modelValue"
    :title="$t('search.filters.dates')"
  />
</template>


<script lang="ts" setup>
import { DateRange } from '@lectorium/mobile/app'
import SearchFilterChipWithDateRange from '@lectorium/mobile/search/components/SearchFilterChipWithDateRange.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const modelValue = defineModel<DateRange>({ required: true, default: { from: '', to: ''} })
</script>