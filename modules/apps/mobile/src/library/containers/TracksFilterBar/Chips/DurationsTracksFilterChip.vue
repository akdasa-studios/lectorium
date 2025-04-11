<template>
  <TracksFilterChipWithListItems 
    v-model="selectedDurations"
    :items="durations"
    title="⏰ Durations"
  />
</template>


<script lang="ts" setup>
import { TracksFilterChipWithListItems } from '@/library'
import { ref, watch } from 'vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
export type Duration = {
  min: number
  max: number
}

const modelValue = defineModel<Duration[]>({ 
  required: true, 
  default: []
})

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const selectedDurations = ref<string[]>([])

const durations = ref([
  { id: 'short',      title: $t('filter-duration-short'),      checked: false, min: 0, max: 15 },
  { id: 'medium',     title: $t('filter-duration-medium'),     checked: false, min: 15, max: 30 },
  { id: 'long',       title: $t('filter-duration-long'),       checked: false, min: 30, max: 60 },
  { id: 'extra-long', title: $t('filter-duration-extra-long'), checked: false, min: 60, max: 60 * 24 },
])

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(selectedDurations, (selected) => {
  const selectedItems = durations.value.filter((item) => selected.includes(item.id))
  modelValue.value = selectedItems.map((item) => ({
    min: item.min,
    max: item.max ?? Number.MAX_SAFE_INTEGER,
  }))
}, { deep: true, immediate: true })

function $t(key: string) {
  return key
}
</script>