<template>
  <TracksFilterChipWithListItems 
    v-model="modelValue"
    :items="state"
    title="👨‍🏫 Authors"
  />
</template>


<script lang="ts" setup>
import { useDAL } from '@/app'
import { useAsyncState } from '@vueuse/core'
import { TracksFilterChipWithListItems } from '@/library'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const modelValue = defineModel<string[]>({ required: true, default: [] })

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { state } = useAsyncState(loadItems, [], { immediate: true, shallow: false })

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

async function loadItems() {
  const allItems = await dal.authors.getAll()
  return allItems
    .map((item) => ({
      id: item._id.replace('author::', ''),
      title: item.fullName['en'],
      checked: false,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}
</script>