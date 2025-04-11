<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-searchbar placeholder="Custom Placeholder" />
      <TracksFilterBar v-model="filters" />
      <!-- <ion-header collapse="fade">
        <ion-toolbar>
          <ion-title size="large">Search</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <ion-list>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
        <ion-item href="/app/library/1">
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item href="/app/library/2">
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item href="/app/library/3">
          <ion-label>Item 3</ion-label>
        </ion-item>
        <ion-item href="/app/library/4">
          <ion-label>Item 4</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonItem, IonList, IonLabel, IonSearchbar } from '@ionic/vue'
import { TracksFilterBar, TracksFilterValue } from '@/library'
import { ref } from 'vue'

const filters = ref<TracksFilterValue>({
  ids: [],
  authors: [],
  sources: [],
  locations: [],
  languages: [],
  durations: [],
  dates: { from: '', to: '' },
})
</script>
