<template>
  <PlayerControls
    :playing="isPlaying"
    :title="title"
    :author="author"
    :class="{
      'player': true,
      'closed': !isPlayerTranscriptOpen,
      'opened': isPlayerTranscriptOpen,
      'hidden': !isVisible
    }"
    @play="togglePause"
    @click="isPlayerTranscriptOpen = !isPlayerTranscriptOpen"
  />
  <TranscriptDialog
    v-model:open="isPlayerTranscriptOpen" 
  >
    <LanguageSelector 
      :languages="languages"
      :active-language="activeLanguage"
      @change-language="onChangeLanguage"
    />
    <TranscriptText
      :sections="sections"
      :time="position"
      @rewind="onRewind"
    />
  </TranscriptDialog>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { 
  PlayerControls, TranscriptSection, TranscriptLanguage, TranscriptText,
  TranscriptDialog, TranscriptBlock, LanguageSelector, usePlayerControls,
  usePlayerTranscript, usePlayerControlsPlayerScenario, usePlayer
} from '@/player'
import { useDAL } from '@/app'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import type { Transcript } from '@lectorium/dal/models'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const player = usePlayer()
const dal = useDAL()
const { isPlaying, title, author, position } = usePlayerControls()
const { isOpen: isPlayerTranscriptOpen, trackId } = usePlayerTranscript()
const { togglePause } = usePlayerControlsPlayerScenario()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const isVisible = computed(() => {
  return title.value !== '' || author.value !== ''
})

const sections = ref<TranscriptSection[]>([])
const languages = ref<TranscriptLanguage[]>([])
const activeLanguage = ref<string>('')

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(trackId, async (value) => {
  if (!value) return
  const track = await dal.tracks.getOne(value)
 
  const languageCodes = track.languages.map((lang) => lang.language) 
  const languageItems = await dal.languages.getMany({
    selector: { code : { $in: languageCodes } },
  })
  languages.value = languageItems.map((lang) => ({
    code: lang.code,
    icon: lang.icon,
  }))

  await loadTranscript(value.replace('::track', ''), track.languages[0].language)
  activeLanguage.value = track.languages[0].language
})

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onRewind(time: number) {
  player.seek({ position: time })
}

async function onChangeLanguage(lang: string) {
  if (!trackId.value) return
  await loadTranscript(trackId.value.replace('::track', ''), lang)
  activeLanguage.value = lang
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

async function loadTranscript(trackId: string, language: string) {
  const result = await Filesystem.readFile({
    path: 'library/tracks/' + trackId + '/transcripts/' + language + '.json',
    directory: Directory.External,
    encoding: Encoding.UTF8,
  })
  const transcript = JSON.parse(result.data as string) as Transcript

  sections.value = []
  let lastSection: TranscriptBlock[] = []
  for (const block of transcript.blocks) {
    if (block.type === 'paragraph') {
      sections.value.push({ blocks: lastSection })
      lastSection = []
    } else {
      lastSection.push(block)
    }
  }
  if (lastSection.length > 0) {
    sections.value.push({ blocks: lastSection })
  }
}
</script>

<style scoped>
.player {
  z-index: 100000;
  position: fixed;
  transition: all .5s ease-in-out;
}

.closed {
  bottom: calc(56px + var(--ion-safe-area-bottom));
  height: 58px;
  left: 16px;
  right: 16px;
  border-radius: 10px;
}

.opened {
  height: calc(56px + (var(--ion-safe-area-bottom)));
  padding-bottom: calc(var(--ion-safe-area-bottom));

  bottom: 0px; 
  left: 0px;
  right: 0px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.hidden {
  opacity: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
