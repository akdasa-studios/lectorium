<template>
  <Page>
    <RandomTrackSuggestions :max-authors="3" />
  </Page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Page, useConfig } from '@lectorium/mobile/app'
import RandomTrackSuggestions from '@lectorium/mobile/library/containers/RandomTrackSuggestions.vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const config = useConfig()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const trackSuggestionsRef = ref<typeof RandomTrackSuggestions>()


/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(config.appLanguage, () => {
  trackSuggestionsRef.value?.refresh()
})
</script>