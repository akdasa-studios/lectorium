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
      v-if="!config.userName.value"
      class="ion-text-nowrap"
    >
      <h2>{{ $t('settings.auth.signIn.title') }}</h2>
      <p>{{ $t('settings.auth.signIn.description') }}</p>
    </IonLabel>
    <IonLabel v-else>
      <h2>{{ config.userName.value }}</h2>
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
import { SocialLogin } from '@capgo/capacitor-social-login'
import { useConfig } from '@lectorium/mobile/features/app.config'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { Routes } from '@lectorium/protocol/index'
import { Events } from '@lectorium/mobile/events'
import { useSyncStore } from '@lectorium/mobile/features/app.services.sync'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
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
  try {
    if (provider === 'apple') {
      const res = await SocialLogin.login({
        provider: 'apple',
        options: {}
      })

      // Login/register user and get JWT tokens from backend
      const response = await fetch(
        Routes(config.apiUrl.value).auth.signIn('jwt'), 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'apple',
            jwt: res.result.accessToken?.token,
          }),
        })
 
      // Check if the response is ok and tokens are received
      const tokens = await response.json()
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('No access token received from server.')
      }

      // Update config with user data and tokens
      // TODO: apple provides givenName and family name only for the first time
      //       for the second time it will be empty. User have to delete the app,
      //       delete app-account in icloud get the names again. So we have to get
      //       the names from the another source in case they are missing.
      const { givenName, familyName, email } = res.result.profile
      config.authToken.value = tokens.accessToken
      config.refreshToken.value = tokens.refreshToken
      config.userName.value = `${givenName} ${familyName}`.trim() || i18n.t('settings.auth.signedIn')
      config.userEmail.value = email || ''

      // Notify events for sync and subscription restoration
      Events.syncRequested.notify({ userId: config.userEmail.value })
      Events.restoreSubscriptionPlanRequested.notify()
      
    } else if (provider === 'google') {
      const res = await SocialLogin.login({
        provider: 'google',
        options: {}
      })

      // Validate response from Google
      if (res.provider !== 'google' || res.result.responseType !== 'online') {
        throw new Error('Invalid response from Google login.')
      }

      // Login/register user and get JWT tokens from backend
      const response = await fetch(
        Routes(config.apiUrl.value).auth.signIn('jwt'), 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'google',
            jwt: res.result.idToken,
          }),
        })
        
      // Check if the response is ok and tokens are received
      const tokens = await response.json()
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('No access token received from server.')
      }

      // Update config with user data and tokens
      config.authToken.value = tokens.accessToken
      config.refreshToken.value = tokens.refreshToken
      config.userName.value = res.result.profile.name || 'Unnamed User' // TODO: use a better default
      config.userEmail.value = res.result.profile.email || ''

      // Notify events for sync and subscription restoration
      Events.syncRequested.notify({ userId: config.userEmail.value })
      Events.restoreSubscriptionPlanRequested.notify()

      // Download avatar image
      if (res.result.profile.imageUrl) {
        Filesystem.downloadFile({
          url: res.result.profile.imageUrl,
          path: 'userAvatar.jpg',
          directory: Directory.External,
        }).then(r => {
          if (r.path) {
            config.userAvatarUrl.value = Capacitor.convertFileSrc(r.path)
          }
        })
      }
    }

    // Parse JWT token to get expiration time
    if (config.authToken.value) {
      const parts = config.authToken.value.split('.')
      const payload = JSON.parse(atob(parts[1]))
      if (payload.exp) { 
        // convert to milliseconds
        config.authTokenExpiresAt.value = payload.exp * 1000
      }
    }
  } catch (error: any) {
    // apple: user canceled the login. 1001 is the error code in the text
    if (error?.errorMessage?.includes('1001')) { return }
    // google: user canceled the login.
    // NOTE: looks like @capgo/capacitor-social-login has a bug, because
    //       cancellation code is 16, and you can see it in the logs. But it returns
    //       nothing to define the reason of the error. Asume this will work.
    if (!error?.code) { return }

    console.error('Authentication error:', error)
    alert(`Authentication failed. Please try again. ${JSON.stringify(error)}`)
  }
}
</script>