<template>
  <IonApp>
    <IonRouterOutlet />

    <!-- Floating Player -->
    <FloatingPlayer 
      v-model:sticked="transcriptStore.open"
      :playing="player.isPlaying.value"
      :title="player.title.value"
      :author="player.author.value"
      :duration="player.duration.value"
      :position="player.position.value"
      :hidden="!player.trackId.value || keyboardVisible.isKeyboardVisible.value"
      :show-progress="config.showPlayerProgress.value"
      @click="transcriptStore.toggleTranscriptOpen"
      @play-clicked="onPlayButtonClicked"
    />

    <!-- Transcript Dialog -->
    <TranscriptDialog 
      v-model:open="transcriptStore.open"
      v-model:active-languages="transcriptStore.activeLanguages"
      :allow-multiple-languages="transcriptStore.allowMultipleLanguages"
      :available-languages="transcriptStore.availableLanguages"
      :paragraphs="transcriptStore.localizedTranscript"
      :position="player.position.value"
      :highlight-current-sentence="config.highlightCurrentSentence.value"
      @seek="position => p.seek({ position: position })"
      @selection-action="onTextSelectionAction"
      @selection-dismissed="onTextSelectionDismissed"
    />
    
    <!-- Navigation Bar Footer -->
    <NavigationBarHolder v-if="!keyboardVisible.isKeyboardVisible.value" />
  </IonApp>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { NavigationBarHolder } from '@lectorium/mobile/features/app.appearance'
import { FloatingPlayer, usePlayer, usePlayerControls } from '@lectorium/mobile/features/player'
import { TranscriptDialog, useTranscriptStore } from '@lectorium/mobile/features/transcript'
import { useKeyboardVisible } from './features/app.core'
import { useNotesFeature } from './features/notes'
import { Clipboard } from '@capacitor/clipboard'
import { useConfig } from '@lectorium/mobile/features/app.config'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const p = usePlayer()
const config = useConfig()
const player = usePlayerControls()
const notesFeature = useNotesFeature()
const transcriptStore = useTranscriptStore()
const keyboardVisible = useKeyboardVisible()

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onTextSelectionAction(
  opts: { text: string, blocks: string[], action: string }
) {
  if (opts.action === 'copy') {
     await Clipboard.write({ string: opts.text })
  } else if (opts.action === 'bookmark') {
    notesFeature.addNote({
      trackId: player.trackId.value,
      text: opts.text,
      blocks: opts.blocks
    })
    transcriptStore.highlight(opts.blocks)
  }
  transcriptStore.removeSelection()
}

function onTextSelectionDismissed() {
  transcriptStore.removeSelection()
}

async function onPlayButtonClicked() {
  await p.togglePause()
  if (player.isPlaying.value && config.openTranscriptAutomatically.value) {
    transcriptStore.open = true
  }
}
</script>
