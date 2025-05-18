<template>
  <IonItem
    :disabled="disabled"
    :class="{ 'dimmed': dimmed, 'track': true }"
    lines="none"
  >
    <TrackState
      :state="icon"
      :progress="progress"
    />
    <IonLabel class="ion-text-nowrap">
      <TrackHeader
        class="info"
        :title="title"
        :references="references"
        :tags="tags"
      />
      <TrackDetails 
        class="details"  
        :author="author"
        :location="location"
        :date="date"
      />
    </IonLabel>
  </IonItem>
</template>


<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { IonItem, IonLabel } from '@ionic/vue'
import TrackState from '@lectorium/mobile/app/components/TrackState.vue'
import TrackDetails from '@lectorium/mobile/app/components/TrackDetails.vue'
import TrackHeader from '@lectorium/mobile/app/components/TrackHeader.vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

export type PlaylistItemIdentity = {
  playlistItemId: string
}

export type PlaylistItemState = {
  progress?: number
}

export type PlaylistItemProps = {
  tags: string[]
  date?: string
  title: string
  author?: string
  location?: string
  completedAt?: number
  references: string[]
}

const props = defineProps<
  & PlaylistItemProps 
  & PlaylistItemState
>()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { progress, completedAt } = toRefs(props)

const loading = computed(() => (progress.value !== undefined && progress.value < 100))
const completed = computed(() => (completedAt.value !== undefined)) 
const disabled = computed(() => loading.value)
const dimmed = computed(() => loading.value || completed.value)
const icon = computed(() => {
  if (completed.value) return 'completed'
  return 'none'
})
</script>

<style scoped>
.track { transition: all 1s ease; }
.dimmed { opacity: .4; }
</style>