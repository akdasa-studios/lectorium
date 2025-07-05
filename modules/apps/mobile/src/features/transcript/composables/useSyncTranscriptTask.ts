import { Ref, watch } from 'vue'
import { useTranscriptLoader } from './useTranscriptLoader'
import { IDatabaseService } from '@lectorium/dal/index'
import { Language, Note, Track } from '@lectorium/dal/models'


type Options = {
  trackId: Ref<string>
  tracksService: IDatabaseService<Track>
  languagesService: IDatabaseService<Language>
  notesService: IDatabaseService<Note>
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