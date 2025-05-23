import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
/* import '@ionic/vue/css/palettes/dark.system.css' */

/* Theme variables */
import './app/theme/variables.css'

import { createI18n } from 'vue-i18n'
import { 
  useConfig,
  useConfigPersistenceFeature,
  useNavigationBarFeature,
  useSafeAreaFeature,
  useCleanupMediaItemsFeature,
  useCleanupFilesFeature,
  useMarkCompletedPlaylistItem,
  useSentryFeature,
  useDatabase,
  useDAL,
  useBucketService,
  useMediaService,
} from './app'
import { 
  useSyncAudioPlayerPluginStateFeature, 
  useSetPlayerControlsInfoFeature,
} from '@lectorium/mobile/player'
import { useArchiveCompletedPlaylistItemsFeature } from './app/features/useArchiveCompletedPlaylistItemsFeature'

/** 
 * Configure PouchDB to use SQLite adapter for Cordova
 */
import PouchDB from 'pouchdb'
import PouchDBAdapterSqlLite from 'pouchdb-adapter-cordova-sqlite'
PouchDB.plugin(PouchDBAdapterSqlLite)

import { useInAppPurchasesFeatures } from './app/features/useInAppPurchasesFeatures'
import { Device } from '@capacitor/device'
import { initTrackStateFeature } from './initTrackStateFeature'
import { initTrackSearchFeature } from './initTrackSearchFeature'
import { useTracksSearchFiltersFeature } from './features/tracks.search.filters'
import { useTracksCountFeature } from './features/tracks.count'
import { useTracksDownloadFeature } from './features/tracks.download'
import { useTrackStateStore } from './features/tracks.state'
import { locale } from './features/app.localization'
import { usePlaylistFeature, useSyncPlaylistStoreTask } from './features/playlist'


const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages: locale
})
const pinia = createPinia()
const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(i18n)
  .use(pinia)

useSentryFeature(app)


router.isReady().then(async () => {
  const start = new Date().getTime()

  // App //
  await useConfigPersistenceFeature()
  await useNavigationBarFeature()
  await useSafeAreaFeature()

  useMarkCompletedPlaylistItem()
  useArchiveCompletedPlaylistItemsFeature()
  useCleanupMediaItemsFeature()
  useCleanupFilesFeature()

  // Features //

  await initTrackStateFeature()
  initTrackSearchFeature()

  const dal = useDAL()
  await useTracksSearchFiltersFeature().init({
    authorsService: dal.authors,
    sourcesService: dal.sources,
    locationsService: dal.locations,
    languagesService: dal.languages,
    durationsService: dal.durations,
  })
  await useTracksCountFeature().init({
    tracksService: dal.tracks
  })
  useTracksDownloadFeature().init({
    tracksService: useDAL().tracks,
    bucketName: useConfig().bucketName.value,
    bucketService: useBucketService(),
    mediaService: useMediaService(),
    onTrackFailed: (trackId) => {
      useTrackStateStore().setState(trackId, { isFailed: true })
    }
  })
  usePlaylistFeature().init({
    playlistService: dal.playlistItems,
  })
  

  // Player //

  useSyncAudioPlayerPluginStateFeature()
  useSetPlayerControlsInfoFeature()

  // Rest //

  useInAppPurchasesFeatures().init()

  const config = useConfig()
  if (config.appLanguage.value === '??') {
    const languageCode = await Device.getLanguageCode()
    if (['en', 'ru'].includes(languageCode.value)) {
      config.appLanguage.value = languageCode.value
    } else {
      config.appLanguage.value = 'ru'
    }
  }
  i18n.global.locale = config.appLanguage.value as 'en' | 'ru'

  // Steps //

  const database = useDatabase()
  await database.init()
  

  // Should be after database.init()
  await useSyncPlaylistStoreTask({
    playlistItemService: dal.playlistItems,
  }).start()

  const elapsed = new Date().getTime() - start
  console.log(`Initialization time: ${elapsed}ms`)

  app.mount('#app')
})