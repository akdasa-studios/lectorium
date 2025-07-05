import { Note, Track } from '@lectorium/dal/models'
import { IRepository } from '@lectorium/dal/index'
import { NotesStore } from './useNotesStore'
import { useLogger } from '../../app.core'

export type Options = {
  notesRepo: IRepository<Note>
  tracksRepo: IRepository<Track>
  notesStore: NotesStore
}

export function useNotesLoader({
  notesRepo: notesService,
  tracksRepo: tracksService,
  notesStore,
}: Options) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const logger = useLogger({ module: 'notes'})


  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  async function load() {
    notesStore.items = []
    const notes = await notesService.getAll({
      limit: 1000 // TODO: add pagination
    })

    const relatedTracks = await tracksService.getMany({
      selector: { _id: { $in: notes.map(note => note.trackId) } },
      limit: 1000 // TODO: add pagination
    })

    for (const note of notes) {      
      const track = relatedTracks.find(t => t._id === note.trackId)
      if (!track) {
        logger.error(`Track not found for note ${note._id} with trackId ${note.trackId}`)
        continue
      }

      notesStore.items.push({
        id: note._id,
        trackId: note.trackId,
        text: note.text,
        blocks: note.blocks,
        trackAuthor: track.author,
        trackTitle: track.title['ru'], // TODO: lang
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { load }
}