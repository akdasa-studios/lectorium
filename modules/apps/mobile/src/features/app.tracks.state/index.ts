/**
 * Track Status Feature
 * 
 * This feature is responsible for tracking the status of tracks.
 */

export { initTrackStateStore } from './composables/initTrackStateStore'
export { useTrackStateStore, type TrackState } from './composables/useTrackStateStore'
export { useUpdateTrackStateFromPlaylistStateTask } from './composables/useUpdateTrackStateFromPlaylistStateTask'
export { default as TrackStateIndicator } from './components/TrackStateIndicator.vue'
