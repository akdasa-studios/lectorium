<template>
  <div
    ref="textSelector"
    @touchend="onTouchEnd"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
  >
    <slot ref="slotRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { onLongPress } from '@vueuse/core'
import { useTemplateRef } from 'vue'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  selectable: HTMLElement[]
  datasetField: string
}>()

const emit = defineEmits<{
  selecting: [items: string[]]
  selected: [items: string[]]
}>()


/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { selectable } = toRefs(props)
const textSelector = useTemplateRef<HTMLElement>('textSelector')
const isInSelectionMode = ref<boolean>(false)
const selectingIds = ref<string[]>([])


/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

onLongPress(
  textSelector,
  onLongPressed,
  {
    modifiers: {
      prevent: true
    }
  }
)

function onTouchStart() {
}

function onTouchEnd() {
  isInSelectionMode.value = false
  emit('selected', selectingIds.value)
  selectingIds.value = []
}

function onTouchMove(event: TouchEvent) {
  if (!isInSelectionMode.value) { return }
  if (event.touches.length === 0) { return }
  event.preventDefault()
  markByCoord(event.touches[0].clientX, event.touches[0].clientY)
}

function onLongPressed(e: PointerEvent) {
  isInSelectionMode.value = true
  markByCoord(e.clientX, e.clientY)
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function markByCoord(
  touchX: number,
  touchY: number
) {
  selectable.value.forEach(box => {
    const rect = box.getBoundingClientRect()
    const isTouchInside = (
      touchX >= rect.left &&
      touchX <= rect.right &&
      touchY >= rect.top &&
      touchY <= rect.bottom
    )

    if (isTouchInside) {
      const blockId = box.dataset[props.datasetField]
      if (blockId && !selectingIds.value.includes(blockId)) {
        selectingIds.value.push(blockId)
      }
    }
  })  
  
  emit('selecting', selectingIds.value)
}
</script>