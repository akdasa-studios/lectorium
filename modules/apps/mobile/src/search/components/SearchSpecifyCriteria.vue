<template>
  <IonItem
    lines="none"
    class="specify-criteria"
  >
    <IonNote>
      {{ $t('search.specifySearchCriteria') }}
    </IonNote>
  </IonItem>
</template>

<script setup lang="ts">
import { IonItem, IonNote } from '@ionic/vue'
</script>