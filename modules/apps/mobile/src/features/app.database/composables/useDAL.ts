import { createSharedComposable } from '@vueuse/core'
import { useDatabase } from './useDatabase'
import { 
  ArchiveService,
  AuthorsRepository, CachingRepository, DurationsRepository, IndexService, 
  LanguagesRepository, LocationsRepository, MediaItemsRepository, NotesRepository, 
  PlaylistItemsRepository, SortMethodsRepository, SourcesRepository, TagsRepository,
  TracksRepository,
  TracksSearchService
} from '@lectorium/dal/index'

export const useDAL = createSharedComposable(() => {
  const database = useDatabase().get()
  const tracksRepo = new CachingRepository(new TracksRepository(database.local.tracks))
  const playlistItemsRepo = new PlaylistItemsRepository(database.local.userData)

  return {
    tracks: tracksRepo,
    tracksSearchService: new TracksSearchService(tracksRepo),
    
    // Dictionary
    tags: new CachingRepository(new TagsRepository(database.local.dictionary)),
    authors: new CachingRepository(new AuthorsRepository(database.local.dictionary)),
    sources: new CachingRepository(new SourcesRepository(database.local.dictionary)),
    locations: new CachingRepository(new LocationsRepository(database.local.dictionary)),
    languages: new CachingRepository(new LanguagesRepository(database.local.dictionary)),
    durations: new CachingRepository(new DurationsRepository(database.local.dictionary)),
    sortMethods: new CachingRepository(new SortMethodsRepository(database.local.dictionary)),

    // Index
    index: new IndexService(database.local.index),
    
    // User data
    mediaItems: new MediaItemsRepository(database.local.userData),
    playlistItems: playlistItemsRepo,
    notes: new NotesRepository(database.local.userData),

    archiveService: new ArchiveService(playlistItemsRepo),
  }
})