<template>
  <IonItem
    lines="none"
    @click="onClicked"
  >
    <!-- User avatar -->
    <div
      slot="start"
    >
      🔑
    </div>
    <IonAvatar
      v-if="config.userAvatarUrl.value"
      slot="end"
    >
      <img
        :src="config.userAvatarUrl.value"
        @error="onAvatarLoadError"
      >
    </IonAvatar>
    
    <!-- Text -->
    <IonLabel
      v-if="!config.userEmail.value"
      class="ion-text-nowrap"
    >
      <h2>{{ $t('settings.auth.signIn.title') }}</h2>
      <p>{{ $t('settings.auth.signIn.description') }}</p>
    </IonLabel>
    <IonLabel v-else>
      <h2>{{ config.userName.value || $t('settings.auth.signedIn') }}</h2>
      <p v-if="syncStore.isSyncing">
        {{ $t('settings.auth.syncing') }}
      </p>
      <p v-else>
        {{ $t('settings.auth.syncCompleted') }}
      </p>
    </IonLabel>
  </IonItem>

  <IonActionSheet
    :header="$t('settings.auth.signIn.subtitle')"
    :is-open="isActionSheetOpen"
    :buttons="actionSheetButtons"
    @did-dismiss="onAuthenticate"
  />
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { IonActionSheet, IonItem, IonLabel, IonAvatar } from '@ionic/vue'
import { useConfig } from '@lectorium/mobile/features/app.config'
import { Capacitor } from '@capacitor/core'
import { Events } from '@lectorium/mobile/events'
import { useSyncStore } from '@lectorium/mobile/features/app.services.sync'

const config = useConfig()
const syncStore = useSyncStore()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const isActionSheetOpen = ref(false) 
const googleAction = { text: 'Google', data: { action: 'google' } }
const appleAction  = { text: 'Apple',  data: { action: 'apple' } }
const cancelAction = { text: 'Cancel', role: 'cancel', data: { action: 'cancel' } }

const actionSheetButtons = 
  Capacitor.getPlatform() === 'ios'     ? [appleAction, googleAction, cancelAction] :
  Capacitor.getPlatform() === 'android' ? [googleAction, cancelAction] : []

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onAuthenticate(
  event: CustomEvent
) {
  if (['google', 'apple'].includes(event.detail?.data?.action)) { 
    authenticate(event.detail.data.action as 'google' | 'apple') 
  }
  isActionSheetOpen.value = false
}

function onClicked() {
  if (Capacitor.getPlatform() === 'android') {
    // there is only one action available on Android
    authenticate('google')
  } else {
    isActionSheetOpen.value = true
  }
}

/**
 * If avatar image fails to load, use placeholder image.
 */
function onAvatarLoadError() {
  config.userAvatarUrl.value = Capacitor.convertFileSrc('avatar-paceholder.png')
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

async function authenticate(provider: 'google' | 'apple') {
  Events.authenticationRequestedEvent.notify({ provider })
}
</script>