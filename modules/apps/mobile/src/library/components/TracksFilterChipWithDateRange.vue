<template>
  <TracksFilterChip 
    :applied="isApplied"
    @click="setDialogOpen(true)"
  >
    {{ title }}
  </TracksFilterChip> 
  <DateRangeSelectorDialog
    :title="title"
    :open="isDialogOpen"
    :value="modelValue"
    @close="setDialogOpen(false)"
    @select="modelValue = $event"
  />
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DateRange, DateRangeSelectorDialog } from '@/app'
import { TracksFilterChip } from '@/library'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

defineProps<{
  title: string
}>()

const modelValue = defineModel<DateRange>({ required: true, default: { from: '', to: ''} })

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const isDialogOpen = ref(false)
const isApplied = computed(() => modelValue.value.from !== '' || modelValue.value.to !== '')

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function setDialogOpen(value: boolean) {
  isDialogOpen.value = value
}
</script>