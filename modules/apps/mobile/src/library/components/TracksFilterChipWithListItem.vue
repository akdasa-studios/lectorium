<template>
  <TracksFilterChip 
    :applied="isApplied"
    @click="setDialogOpen(true)"
  >
    {{ title }}
  </TracksFilterChip> 
  <ListItemSelectorDialog
    v-model="modelValue"
    :title="title"
    :items="items"
    :open="isDialogOpen"
    @close="setDialogOpen(false)"
  />
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ListItemSelectorDialog, type ListItemSelectorItem } from '@/app'
import { TracksFilterChip } from '@/library'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

defineProps<{
  title: string
  items: ListItemSelectorItem[]
}>()

const modelValue = defineModel<string|undefined>({ required: true, default: undefined })

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const isDialogOpen = ref(false)
const isApplied = computed(() => modelValue.value !== undefined)


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function setDialogOpen(value: boolean) {
  isDialogOpen.value = value
}
</script>