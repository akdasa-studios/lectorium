<template>
  <TextSelector
    ref="htmlRefHook"
    class="transcript-text"
    dataset-field="blockId"
    :selectable="boxRefs"
    @selecting="onSelecting"
    @selected="onSelected"
  >
    <p
      v-for="(section, idx) in paragraphs"
      :key="idx"
      :class="{
        'prompter': true,
        'paragraph': section.sentences[0]?.start <= position && section.sentences[section.sentences.length-1].end >= position
      }"
    >
      <Timestamp
        v-if="section.sentences[0]?.start"
        :start="section.sentences[0]?.start"
      />
      <component
        :is="'span'"
        v-for="block in section.sentences"
        ref="boxRefs"
        :key="block.id"
        :lang="block.speaker"
        :class="{
          'current': block.start <= position && block.end >= position,
          'highlighted': block.highlighted,
        }"
        :data-block-id="block.id"
        @click="emit('seek', block.start)"
      >
        <SpeakerLine
          :text="block.text"
          :icon="showSpeakerIcons ? block.icon : undefined"
        />
      </component>
    </p>
  </TextSelector>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Timestamp from './Timestamp.vue'
import TextSelector from './TextSelector.vue'
import { SpeakerLine } from '@lectorium/mobile/features/transcript'
import { TranscriptParagraph } from '../models'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  showSpeakerIcons: boolean
  paragraphs: TranscriptParagraph[]
  position: number
}>()

const emit = defineEmits<{
  seek: [position: number]
  textSelected: [{ text: string, blocks: string[] }]
}>()


/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const boxRefs = ref<HTMLElement[]>([])

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

function onSelecting(ids: string[]) {
  const selected = props.paragraphs
    .flatMap(x => x.sentences)
    .filter(x => ids.includes(x.id))
  selected.forEach(x => x.highlighted = true)
}

function onSelected(ids: string[]) {
  const selected = props.paragraphs
    .flatMap(x => x.sentences)
    .filter(x => ids.includes(x.id))
  
  if (selected.length > 0) {
    emit('textSelected', { 
      text: selected.map(x => x.text).join(' '),
      blocks: selected.map(x => x.id)
    })
  }
}
</script>


<style scoped>
.transcript-text {
  text-align: justify;
  text-justify: inter-word;
  hyphens: auto;
  -moz-hyphens: auto;
}

span {
  transition: all .5s ease-in-out;
}

.prompter {
  color: white;
  transition: all 0.5s;
  transform: scale(0.95);
  opacity: .5;
}

.paragraph {
  word-wrap: break-word;
  transform: scale(1.01);
  opacity: 1;
}

.current {
  transition: all 0.5s;
  color: #FF6B6B !important;
}

.highlighted {
  color: #C77DFF;
}
</style>