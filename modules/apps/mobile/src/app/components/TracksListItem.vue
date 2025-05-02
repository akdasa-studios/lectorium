<template>
  <IonItem
    :disabled="!enabled"
    :class="{ 'dimmed': ['completed', 'failed', 'loading'].includes(status) }"
    @click="onItemClicked"
  >
    <IonIcon
      v-if="statusIcon.icon && status !== 'loading'"
      slot="end"
      aria-hidden="true"
      :icon="statusIcon.icon"
      :color="statusIcon.color"
      class="icon"
    />

    <RadialProgress
      v-if="status==='loading'"
      slot="end"
      :stroke-width="4"
      :inner-stroke-width="4"
      :diameter="24"
      :completed-steps="progress"
      :total-steps="100"
      start-color="var(--ion-color-primary)"
      stop-color="var(--ion-color-primary)"
      inner-stroke-color="var(--ion-color-light)"
    />
  
    <IonLabel class="ion-text-nowrap">
      <h3 class="title-block">
        <span
          v-if="references[0]"
          class="reference"
        >
          {{ references[0] }}
        </span>
        <span class="title">{{ title }}</span>
      </h3>
      <p class="details">
        {{ author }}
        <template v-if="location">
          • {{ location }}
        </template>
        <template v-if="date">
          • {{ date }}
        </template>
      </p>
    </IonLabel>
  </IonItem>
</template>


<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { closeCircle, arrowDownCircle, checkmarkCircle, checkmarkDoneCircle } from 'ionicons/icons'
import RadialProgress from 'vue3-radial-progress'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
export type TracksListItemStatus =
  | 'none'
  | 'loading'
  | 'failed'
  | 'added'
  | 'completed'

export type TracksListItemData = {
  trackId: string
  title: string
  author: string
  location?: string
  references: string[]
  status: TracksListItemStatus,
  progress?: number
  date: string
}

const props = withDefaults(defineProps<
  TracksListItemData & {
    enabled?: boolean
  }
>(), {
  enabled: true, 
  location: undefined,
  progress: 0,
})

const emit = defineEmits<{
  click: []
}>()

const { progress } = toRefs(props) 

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */
type StatusIconMap = {
  [key in TracksListItemStatus]: { icon?: string, color?: string }
}

const statusIconMaps: StatusIconMap = {
  'none':      { icon: undefined,           color: undefined },
  'loading':   { icon: arrowDownCircle,     color: 'medium'  },
  'failed':    { icon: closeCircle,         color: 'danger'  },
  'added':     { icon: checkmarkCircle,     color: 'medium' },
  'completed': { icon: checkmarkDoneCircle, color: 'medium' },
}
const statusIcon = computed(
  () => statusIconMaps[props.status]
)

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */
function onItemClicked() {
  emit('click')
}
</script>

<style scoped>
.title-block {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  gap: 5px;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
}

.reference {
  background-color: var(--ion-color-medium);
  font-weight: bold;
  color: var(--ion-color-light);
  border-radius: 5px;
  padding: 0px 5px;
  font-size: 0.8em;
}

.icon {
  width: 12px;
  opacity: .4;
}

.dimmed .title,
.dimmed .reference,
.dimmed .icon,
.dimmed .details {
  opacity: .4;
}
</style>