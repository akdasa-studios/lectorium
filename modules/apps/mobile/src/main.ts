import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import LectoriumApp from './App.vue'
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
import './features/app.ui.kit/styles/variables.css'

import { createI18n } from 'vue-i18n'
import { useArchiveCompletedPlaylistItemsFeature } from './features/playlist/composables/useArchiveCompletedPlaylistItemsFeature'

/** 
 * Configure PouchDB to use SQLite adapter for Cordova
 */
import PouchDB from 'pouchdb'
import PouchDBAdapterSqlLite from 'pouchdb-adapter-cordova-sqlite'
PouchDB.plugin(PouchDBAdapterSqlLite)

import { useInAppPurchasesFeatures } from './features/app.purchases/composables/useInAppPurchasesFeatures'
import { Device } from '@capacitor/device'
import { initTrackSearchFeature } from './init/initTrackSearchFeature'
import { useTracksCountFeature } from './features/tracks.count'
import { useTracksDownloadTask } from './features/tracks.download'
import { locale } from './features/app.localization'
import { useCleanupMediaItemsFeature, useMarkCompletedPlaylistItem, usePlaylistFeature, useSyncPlaylistStoreTask } from './features/playlist'
import { useBucketService } from './features/app.services.bucket'
import { useConfig, useConfigPersistenceTask } from './features/app.config'
import { useDAL, useDatabase } from './features/app.database'
import { useSentryFeature } from './features/app.infra.sentry'
import { useNavigationBarAppearanceTask, useSafeAreaTask } from './features/app.appearance'
import { useCleanupFilesFeature } from './features/app.storage'
import { usePlayerControls, useSetPlayerControlsInfoFeature, useSyncAudioPlayerPluginStateFeature } from './features/player'
import { useSyncTranscriptTask, useTranscriptStore } from './features/transcript'
import { useNotesLoader, useNotesSearchIndex, useNotesSearchTask, useNotesStore } from './features/notes'
import { useRestoreSubscriptionPlan } from './features/app.purchases'
import { useTrackSearchFiltersPersistenceTask } from './features/tracks.search.results'
import { useAnalytics, useAnalyticsRecorderTask } from './features/app.analytics'
import { useSocialAuth } from './features/app.auth'
import { useCommonDataSyncTask } from './features/app.services.sync.commonData'
import { Events, Slots } from './events'
import { useUserDataSyncTask } from './features/app.services.sync.userData'
import { useMediaSyncTask } from './features/app.services.sync.media'
import { useIdGenerator } from './features/app.core'
import { useDownloadingTask } from './features/app.services.download'
import { initTrackState, useSyncDownloadingStateTask, useSyncPlaylistStateTask } from './features/tracks.state'
import { useDebounceFn } from '@vueuse/core'

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages: locale
})
const pinia = createPinia()
const app = createApp(LectoriumApp)
  .use(IonicVue)
  .use(router)
  .use(i18n)
  .use(pinia)

useSentryFeature(app)


router.isReady().then(async () => {
  const start = new Date().getTime()


  // Core //
  await useConfigPersistenceTask().start()
  
  /**
   * Initialize local and remote databases.
   */
  await useDatabase().init({
    remoteDatabaseUrl: useConfig().databaseUrl.value,
    remoteDatabaseAuthToken: () => {
      const token = useConfig().authToken.value
      return token
    },
    remoteUserDataCollectionName: () => {
      if (!useConfig().userEmail.value) { return '' }
      const dbname = 'users-' + useConfig().userEmail.value?.replace(/[^a-zA-Z0-9_]/g, '-')
      return dbname
    }
  })

  // App //

  useAnalyticsRecorderTask()

  // app.appearance //
  await useNavigationBarAppearanceTask({
    isTranscriptDialogOpen: useTranscriptStore().isOpen
  }).start()
  await useSafeAreaTask().start()
  
  useMarkCompletedPlaylistItem()
  useArchiveCompletedPlaylistItemsFeature()
  useCleanupMediaItemsFeature()
  useCleanupFilesFeature()
  
  useSyncTranscriptTask({ 
    trackId: usePlayerControls().trackId,
    languagesService: useDAL().languages,
    tracksService: useDAL().tracks,
    notesService: useDAL().notes,
  })

  // Features //

  initTrackSearchFeature()

  const dal = useDAL()
  await useTracksCountFeature().init({
    tracksService: dal.tracks
  })
  usePlaylistFeature().init({
    playlistService: dal.playlistItems,
  })
  await useNotesSearchIndex().init({
    notesService: useDAL().notes
  })
  useNotesSearchTask({
    notesStore: useNotesStore()
  })

  // Player //

  useSyncAudioPlayerPluginStateFeature()
  useSetPlayerControlsInfoFeature()

  // Rest //

  await useInAppPurchasesFeatures().init()
  await useRestoreSubscriptionPlan().init()
  await useTrackSearchFiltersPersistenceTask().start()

  await useSocialAuth().init()

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

  /* -------------------------------------------------------------------------- */
  /*                                  Playlist                                  */
  /* -------------------------------------------------------------------------- */

  Events.playlistUpdateRequested.subscribe(async (event) => {
    useSyncPlaylistStoreTask({
      playlistItemService: dal.playlistItems,
    }).sync(event.language)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Sync                                    */
  /* -------------------------------------------------------------------------- */

  const debouncedFn = useDebounceFn(async (userId?: string) => {
    // sync common data
    await useCommonDataSyncTask({
      localDatabasesSource: useDatabase().get().local,
      remoteDatabasesSource: useDatabase().get().remote,
    }).sync()
    Events.syncTaskCompleted.notify({ task: 'commonData' })

    // sync user data
    await useUserDataSyncTask({
      userId,
      localDatabasesSource: useDatabase().get().local,
      remoteDatabasesSource: useDatabase().get().remote,
    }).sync()
    Events.syncTaskCompleted.notify({ task: 'userData' })

    // sync media items
    const result = await useMediaSyncTask({
      mediaItemsService: useDAL().mediaItems,
      playlistItemsService: useDAL().playlistItems,
    }).sync()
    result.newTrackIds.forEach((trackId) => {
      Events.trackDownloadRequested.notify({ trackId })
    })
    Events.syncTaskCompleted.notify({ task: 'media' })
  }, 5000, { maxWait: 15000 })

  Events.syncRequested.subscribe(async ({ userId }) => {
    debouncedFn(userId)
  })

  Events.syncTaskCompleted.subscribe(async (event) => {
    if (event.task === 'userData') { 
      await Events.playlistUpdateRequested.notify({ 
        language: useConfig().appLanguage.value
      })
      await Events.notesUpdateRequestes.notify()
    }
  })

  useDAL().playlistItems.subscribe(async () => {
    Events.syncRequested.notify({ userId: useConfig().userEmail.value })
  })

  useDAL().notes.subscribe(async () => {
    Events.syncRequested.notify({ userId: useConfig().userEmail.value })
  })


  /* -------------------------------------------------------------------------- */
  /*                                 Downloader                                 */
  /* -------------------------------------------------------------------------- */

  Events.downloaderTaskEnqueueRequested.subscribe(async (event) => {
    const task = await useDownloadingTask({
      downloaderTaskFailedEvent: Events.downloaderTaskFailed,
      downloaderTaskStatusEvent: Events.downloaderTaskStatus,
      downloaderTaskEnqueuedEvent: Events.downloaderTaskEnqueued,
      downloaderTaskCompletedEvent: Events.downloaderTaskCompleted,
      getDownloaderTasksSlot: Slots.getDownloaderTasks
    })
    task.enqueue(event)
  })

  /* -------------------------------------------------------------------------- */
  /*                               Tracks Download                              */
  /* -------------------------------------------------------------------------- */

  Events.trackDownloadRequested.subscribe(async (event) => {
    useTracksDownloadTask({
      trackDownloadFailedEvent: Events.trackDownloadFailed,
      downloaderTaskFailedEvent: Events.downloaderTaskFailed,
      downloaderTaskCompletedEvent: Events.downloaderTaskCompleted,
      downloaderTaskEnqueueRequestedEvent: Events.downloaderTaskEnqueueRequested,
      bucketName: () => useConfig().bucketName.value,
      bucketService: () => useBucketService(),
      tracksService: () => useDAL().tracks,
      mediaItemsService: () => useDAL().mediaItems,
      uniqueIdGenerator: () => useIdGenerator().generateId(22)
    }).download(event.trackId)
  })

  /* -------------------------------------------------------------------------- */
  /*                                Tracks State                                */
  /* -------------------------------------------------------------------------- */

  await initTrackState({
    mediaItemsService: useDAL().mediaItems,
    playlistItemsService: useDAL().playlistItems
  })
  
  useSyncPlaylistStateTask({
    playlistItemService: dal.playlistItems
  })

  useSyncDownloadingStateTask({
    downloaderGetTasksSlot: Slots.getDownloaderTasks,
    downloaderTaskFailedEvent: Events.downloaderTaskFailed,
    downloaderTaskStatusEvent: Events.downloaderTaskStatus,
    downloaderTaskEnqueuedEvent: Events.downloaderTaskEnqueued,
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Notes                                   */
  /* -------------------------------------------------------------------------- */
  
  Events.notesUpdateRequestes.subscribe(async () => {
    await useNotesLoader({
      notesService: useDAL().notes,
      tracksService: useDAL().tracks,
      notesStore: useNotesStore()
    }).load()
  })

  /* -------------------------------------------------------------------------- */
  /*                                   Screens                                  */
  /* -------------------------------------------------------------------------- */

  useDAL().playlistItems.subscribe(async () => {
    Events.playlistUpdateRequested.notify({
      language: useConfig().appLanguage.value
    })
  })

  useDAL().notes.subscribe(async () => {
    Events.notesUpdateRequestes.notify()
  })

  watch(config.appLanguage, (language: string) => {
    Events.playlistUpdateRequested.notify({ language })
  })

  /* -------------------------------------------------------------------------- */
  /*                             Fire Initial Events                            */
  /* -------------------------------------------------------------------------- */

  Events.syncRequested.notify({
    userId: useConfig().userEmail.value
  })
  Events.playlistUpdateRequested.notify({ language: useConfig().appLanguage.value })
  Events.notesUpdateRequestes.notify()

  /* -------------------------------------------------------------------------- */
  /*                          Initialization Analytics                          */
  /* -------------------------------------------------------------------------- */

  const elapsed = new Date().getTime() - start
  useAnalytics().track('app.init', { initTime: elapsed })
  useAnalytics().track('app.open')
  console.log(`Initialization time: ${elapsed}ms`)

  app.mount('#app')
})