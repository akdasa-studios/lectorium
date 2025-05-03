<template>
  <template 
    v-for="author in authors"
    :key="author.id"
  >
    <TrackSuggestionsSection
      :max="4"
      :title="authorName(author)"
      :selector="{ 'author': author._id.replace('author::', '') }"
    />
  </template>
</template>


<script setup lang="ts">
import { useDAL } from '@lectorium/mobile/app'
import { useAsyncState } from '@vueuse/core'
import { type Author } from '@lectorium/dal/models'
import { useRandomAuthors } from '@lectorium/mobile/library/composables/useRandomAuthors'
import { useLocalizedAuthorName } from '@lectorium/mobile/app/composables/useLocalizedAuthorName'
import TrackSuggestionsSection from '@lectorium/mobile/library/containers/TrackSuggestionsSection.vue'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const dal = useDAL()
const randomAuthors = useRandomAuthors()
const authorName = useLocalizedAuthorName()


/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  maxAuthors: number
}>()


/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { state: authors } = useAsyncState(
  async () => { 
    // TODO: listentosadhu specific logic, extract to config
    const [acbsp, rest] = await Promise.all([
      dal.authors.findOne({ _id: 'author::acbsp' }),
      randomAuthors.get({ 
        max: props.maxAuthors, 
        selector: { _id: { $ne: 'author::acbsp' } } 
      })
    ])
    return [acbsp, ...rest].filter(x => x !== undefined) as Author[]
  }, [], { immediate: true, resetOnExecute: false }
)
</script>
