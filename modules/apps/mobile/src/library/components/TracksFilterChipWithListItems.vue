<template>
  <TracksFilterChip 
    :applied="isApplied"
    @click="setDialogOpen(true)"
  >
    {{ title }}
  </TracksFilterChip> 
  <ListItemsSelectorDialog
    v-model:items="items"
    :title="title"
    :open="isDialogOpen"
    @close="setDialogOpen(false)"
  />
</template>


<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue'
import { ListItemsSelectorDialog, type SelectorDialogItem } from '@/app'
import { TracksFilterChip } from '@/library'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  title: string
  items: SelectorDialogItem[]
}>()

const modelValue = defineModel<string[]>({ required: true, default: [] })

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const isDialogOpen = ref(false)
const isApplied = computed(() => modelValue.value.length > 0)
const { items } = toRefs(props)

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(items, (items) => {
  modelValue.value = items
    .filter((item) => item.checked)
    .map((item) => item.id)
}, { deep: true })


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function setDialogOpen(value: boolean) {
  isDialogOpen.value = value
}
</script>