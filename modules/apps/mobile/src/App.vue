<template>
  <IonApp>
    <IonRouterOutlet />
    <Player />
    <Transcript />
    <NavigationBarHolder />
  </IonApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { NavigationBarHolder, useSyncService, useSafeOperation } from '@lectorium/mobile/app'
import { Player, Transcript } from '@lectorium/mobile/player'
import { useRouter } from 'vue-router'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const syncService = useSyncService()
const safeOperation = useSafeOperation()
const router = useRouter()

/* -------------------------------------------------------------------------- */
/*                                    Demo                                    */
/* -------------------------------------------------------------------------- */

// Demo 
try {
  if (window.location.host === 'mobile.listentosadhu.app') {
    const css = `
    body {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      touch-action: manipulation;
    }`
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    head.appendChild(style)
    style.appendChild(document.createTextNode(css))
    router.replace({ name: 'search' })
  }
} catch(e) { console.log(e) }

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  safeOperation.execute({
    operation: async () => { await syncService.sync() }
  })
})
</script>
