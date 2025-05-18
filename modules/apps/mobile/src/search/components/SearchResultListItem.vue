<template>
  <IonItem
    class="track"
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

export type SearchResultListItemState = {
  added?: boolean
  completed?: boolean
  progress?: number
}

export type SearchResultListItemProps = {
  tags: string[]
  date?: string
  title: string
  author?: string
  location?: string
  references: string[]
}

export type SearchResultListItemIdentity = {
  trackId: string
}

const props = defineProps<
  & SearchResultListItemProps 
  & SearchResultListItemState
>()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { added, completed, progress } = toRefs(props) 

const icon = computed(() => {
  if (completed.value) return 'completed'
  if (added.value) return 'added'
  return 'none'
})
</script>

<style scoped>
.track,
.info,
.details {
  opacity: 1;
  transition: all 1s ease;
}
</style>