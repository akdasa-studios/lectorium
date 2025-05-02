<template>
  <Page>
    <UpNextTracksSection ref="upNextTracksRef" />
    <TrackSuggestionsSection ref="trackSuggestionsRef" />
  </Page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { TrackSuggestionsSection, UpNextTracksSection } from '@lectorium/mobile/home'
import { Page, useDAL, useConfig } from '@lectorium/mobile/app'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()
const config = useConfig()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const upNextTracksRef = ref<typeof UpNextTracksSection>() 
const trackSuggestionsRef = ref<typeof TrackSuggestionsSection>()
const refreshDeferred = useDebounceFn(() => { refresh() }, 100, { maxWait: 500 })


/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

dal.mediaItems.subscribe(refreshDeferred) // ADD debounce
dal.playlistItems.subscribe(refreshDeferred)
watch(config.appLanguage, () => {
  refreshDeferred()
  trackSuggestionsRef.value?.refresh()
})

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function refresh() {
  await upNextTracksRef.value?.refresh()
}
</script>