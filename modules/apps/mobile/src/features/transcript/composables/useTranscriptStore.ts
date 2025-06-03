import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TranscriptLanguage, TranscriptParagraph } from '../models'


export const useTranscriptStore = defineStore('transcript', () => {
  
  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const open = ref(false)
  const transcript = ref<TranscriptParagraph[]>([])
  const activeLanguages = ref<string[]>([])
  const availableLanguages = ref<TranscriptLanguage[]>([])
  const allowMultipleLanguages = ref<boolean>(false)

  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  const isOpen = computed(() => open)
  const localizedTranscript = computed(() => {
    return transcript.value
      .map(paragraph => {
        return {
          ...paragraph,
          sentences: paragraph.sentences.filter(sentence => 
            activeLanguages.value.includes(sentence.language)
          )
        }
      })
  })


  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  async function toggleTranscriptOpen() {
    open.value = !open.value
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { 
    open,
    isOpen,
    transcript, 
    activeLanguages,
    availableLanguages,
    allowMultipleLanguages,
    localizedTranscript,
    toggleTranscriptOpen,
  }
})