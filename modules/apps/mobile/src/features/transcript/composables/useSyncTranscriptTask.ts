import { Ref, watch } from 'vue'
import { useTranscriptLoader } from './useTranscriptLoader'
import { IRepository } from '@lectorium/dal/index'
import { Language, Note, Track } from '@lectorium/dal/models'


type Options = {
  trackId: Ref<string>
  tracksService: IRepository<Track>
  languagesService: IRepository<Language>
  notesService: IRepository<Note>
}

export function useSyncTranscriptTask({
  trackId,
  tracksService,
  languagesService,
  notesService,
}: Options) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const transcriptLoader = useTranscriptLoader({ 
    tracksService, languagesService, notesService
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  watch(trackId, async (v) => { await transcriptLoader.load(v) })
}