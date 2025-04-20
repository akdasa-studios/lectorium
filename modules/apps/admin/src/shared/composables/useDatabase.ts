import { createSharedComposable } from '@vueuse/core'
import { Database } from '@lectorium/dal/persistence/Database'

export const useDatabase = createSharedComposable(() => {
  // TODO: add config
  // const schema = window.location.protocol;
  // const hostname = window.location.hostname;
  // const serverBaseUrl = `${schema}//${hostname}/database`
  const serverBaseUrl = 'http://localhost:5984/'

  return {
    local: {
      tracks: new Database({ name: 'tracks.db' }),
      transcripts: new Database({ name: 'transcripts.db' }),
      dictionary: new Database({ name: 'dictionary.db' }),
      index: new Database({ name: 'index.db' }),
      inboxTracks: new Database({ name: 'inbox.db' }),
    },
    remote: {
      tracks: new Database({ name: serverBaseUrl + '/tracks' }),
      transcripts: new Database({
        name: serverBaseUrl + '/transcripts',
      }),
      dictionary: new Database({ name: serverBaseUrl + '/dictionary' }),
      index: new Database({ name: serverBaseUrl + '/index' }),
      inboxTracks: new Database({ name: serverBaseUrl + '/inbox' }),
    },
  }
})
