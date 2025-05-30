<template>
  <IonModal
    :is-open="open"
    class="transcript-dialog"
    @did-dismiss="open = false"
  >
    <IonContent
      :fullscreen="true"
      class="ion-padding"
    >
      <LanguageSelector 
        v-if="availableLanguages.length > 1"
        v-model:active="activeLanguages"
        :languages="availableLanguages"
        :allow-multiple="allowMultipleLanguages"
      />
      <TranscriptText
        :paragraphs="paragraphs"
        :position="position"
        :show-speaker-icons="allowMultipleLanguages"
        @seek="position => emit('seek', position)"
        @text-selected="x => emit('textSelected', x)"
      />
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
import { IonModal, IonContent } from '@ionic/vue'
import { TranscriptLanguage, TranscriptParagraph } from '../models'
import { default as LanguageSelector } from './LanguageSelector.vue'
import { default as TranscriptText } from './TranscriptText.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

defineProps<{
  allowMultipleLanguages: boolean
  availableLanguages: TranscriptLanguage[]
  paragraphs: TranscriptParagraph[]
  position: number
}>()

const emit = defineEmits<{
  seek: [position: number]
  textSelected: [{ text: string, blocks: string[] }]
}>()

const open = defineModel<boolean>('open', { default: false, required: true })
const activeLanguages = defineModel<string[]>('activeLanguages', { default: [], required: true })
</script>


<style scoped>
ion-modal ion-content {
  --background: #1D263B;
}

ion-modal ion-toolbar {
  --background: #1D263B;
}

.transcript-dialog {
  z-index: 9000 !important;
}
</style>