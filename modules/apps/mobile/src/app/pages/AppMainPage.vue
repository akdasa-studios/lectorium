<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom">
        <IonTabButton
          tab="tab1"
          href="/app/home"
        >
          <IconHome />
          <IonLabel>{{ $t('app.home') }}</IonLabel>
        </IonTabButton>

        <!-- <IonTabButton
          tab="tab2"
          href="/app/library"
        >
          <IconLibrary />
          <IonLabel>{{ $t('app.library') }}</IonLabel>
        </IonTabButton> -->

        <IonTabButton
          tab="tab3"
          href="/app/search"
        >
          <IconSearch />
          <IonLabel>{{ $t('app.search') }}</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="tab4"
          href="/app/settings"
        >
          <IconSettings />
          <IonLabel>{{ $t('app.settings') }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue'
import { IconHome, IconSearch, IconSettings } from '@lectorium/mobile/app'
// import IconLibrary from '@lectorium/mobile/app/icons/IconLibrary.vue'
</script>

<style scoped>
ion-tab-bar {
  --border: 0;
  --background: linear-gradient(
    to bottom,
    rgba(var(--ion-background-color-rgb, 255, 255, 255), 0)   0%,
    rgba(var(--ion-background-color-rgb, 255, 255, 255), .8) 35%,
    rgba(var(--ion-background-color-rgb, 255, 255, 255), 1)  100%
  );
  padding-top: 50px;
}

ion-tab-button {
  --ripple-color: rgba(0, 0, 0, 0);
}
</style>