import { createSharedComposable } from '@vueuse/core'
import { 
  AuthorsService, LanguagesService, LocationsService, MediaItemsService,
  PlaylistItemsService, SourcesService, IndexService, TracksService,
  TagsService, DurationsService, NotesService, SortMethodsService
} from '@lectorium/dal/index'
import { useDatabase } from './useDatabase'

export const useDAL = createSharedComposable(() => {
  const database = useDatabase().get()

  return {
    tracks: new TracksService(database.local.tracks),
    
    // Dictionary
    tags: new TagsService(database.local.dictionary),
    authors: new AuthorsService(database.local.dictionary),
    sources: new SourcesService(database.local.dictionary),
    locations: new LocationsService(database.local.dictionary),
    languages: new LanguagesService(database.local.dictionary),
    durations: new DurationsService(database.local.dictionary),
    sortMethods: new SortMethodsService(database.local.dictionary),

    // Index
    index: new IndexService(database.local.index),
    
    // User data
    mediaItems: new MediaItemsService(database.local.userData),
    playlistItems: new PlaylistItemsService(database.local.userData),
    notes: new NotesService(database.local.userData)
  }
})