<template>
  <Menubar />
  <br>

  <InboxTrackTableIsle
    @open="onTrackSelected"
  />

  <InboxTrackEditor
    v-model:visible="trackEditorVisible"
    v-model:track-id="trackEditorTrackId"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { InboxTrackEditor, InboxTrackTableIsle } from "@brahma/library/inbox"
import { Menubar, useSync, } from "@brahma/shared"

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const { sync } = useSync()


/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const trackEditorVisible = ref(false);
const trackEditorTrackId = ref<string>()


/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

onMounted(() => { sync() })


/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onTrackSelected(trackId: string) {
  trackEditorTrackId.value = trackId
  trackEditorVisible.value = true
}
</script>
