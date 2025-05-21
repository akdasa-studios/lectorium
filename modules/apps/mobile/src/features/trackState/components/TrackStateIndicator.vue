<template>
  <StateIndicator
    :state="state"
    :progress="trackStateStore.getState(trackId).downloadProgress"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrackStateStore } from '../composables/useTrackStateStore'
import StateIndicator from './StateIndicator.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  trackId: string
  ignoreStates?: string[]
}>()

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const trackStateStore = useTrackStateStore()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const state = computed(() => {
  const inPlaylist = trackStateStore.getState(props.trackId).inPlaylist
  const state = inPlaylist ? 'added' : 'none'
  if (props.ignoreStates && props.ignoreStates.includes(state)) {
    return 'none'
  }
  return state
})
</script>
