import { watchDebounced } from '@vueuse/core'
import { useDAL } from '../../app.database'
import { useTranscriptStore } from '../../transcript'
import { useAnalytics } from './useAnalytics'
import { App } from '@capacitor/app'

export function useAnalyticsRecorderTask() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */
  
  const analysis = useAnalytics()
  const dal = useDAL()
  const transcriptStore = useTranscriptStore()

  /* -------------------------------------------------------------------------- */
  /*                                   Metrics                                  */
  /* -------------------------------------------------------------------------- */

  dal.playlistItems.subscribe(async (e) => {
    if (e.event === 'added') { 
      analysis.track('app.playlist.trackAdded', { 
        trackId: e.item.trackId 
      }) 
    }
  })

  dal.notes.subscribe(async (e) => {
    if (e.event === 'added') {
      analysis.track('app.notes.noteAdded', {
        trackId: e.item.trackId,
        length: e.item.text.length,
      })
    }
  })

  watchDebounced(() => transcriptStore.open, (v) => {
    if (!v) { return }
    analysis.track('app.player.transcript.open') 
  })

  // watchDebounced(trackSearchResultsStore.filters, (f) => {
  //   if (f == useConfig().savedTracksFilter.value) {
  //     return // do not track stored value
  //   }

  //   alert('TRACKED')
  //   analysis.track('app.tracks.search', f)
  // }, { debounce: 1000, maxWait: 3000, immediate: false })

  App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) { analysis.track('app.open') }
  })

}