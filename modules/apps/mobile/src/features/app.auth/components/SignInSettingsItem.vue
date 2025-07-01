<template>
  <IonItem
    id="open-action-sheet"
    lines="none"
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
      <img :src="config.userAvatarUrl.value">
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
      <p>{{ $t('settings.auth.syncCompleted') }}</p>
    </IonLabel>
  </IonItem>

  <IonActionSheet
    :header="$t('settings.auth.signIn.title')"
    trigger="open-action-sheet"
    :buttons="actionSheetButtons"
    @did-dismiss="onAuthenticate"
  />
</template>


<script setup lang="ts">
import { IonActionSheet, IonItem, IonLabel, IonAvatar } from '@ionic/vue'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { useConfig } from '@lectorium/mobile/features/app.config'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { Routes } from '@lectorium/protocol/index'
import { Events } from '@lectorium/mobile/events'

const config = useConfig()

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const actionSheetButtons = [
  {
    text: 'Google',
    data: {
      action: 'google',
    },
  },
  // {
  //   text: 'Apple',
  //   data: {
  //     action: 'apple',
  //   },
  // },
  {
    text: 'Cancel',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
]

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

async function onAuthenticate(
  event: CustomEvent
) {
  try {
    if (!event.detail?.data?.action) { return }
    if (event.detail?.data?.action === 'cancel') { return }

    // authenticate via selected provider
    const res = await SocialLogin.login<'google'>({
      provider: event.detail.data.action,
      options: {}
    })

    // process response
    if (res.provider === 'google' && res.result.responseType === 'online') {
      // Register user via API
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
        
      const tokens = await response.json()
      if (!tokens.accessToken) {
        throw new Error('No access token received from server.')
      }

      config.authToken.value = tokens.accessToken
      config.userName.value = res.result.profile.name || ''
      config.userEmail.value = res.result.profile.email || ''
      Events.syncRequested.notify({ userId: config.userEmail.value })

      // Download avatar image
      if (res.result.profile.imageUrl) {
        Filesystem.downloadFile({
          url: res.result.profile.imageUrl,
          path: 'userAvatar.png',
          directory: Directory.External,
        }).then(r => {
          if (r.path) {
            config.userAvatarUrl.value = Capacitor.convertFileSrc(r.path)
          }
        })
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    alert('Authentication failed. Please try again.' + JSON.stringify(error))
  }
}
</script>