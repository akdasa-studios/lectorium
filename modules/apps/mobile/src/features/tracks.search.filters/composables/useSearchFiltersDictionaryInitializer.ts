import { useSearchFiltersDictionaryStore } from './useSearchFiltersDictionaryStore'
import { AuthorsService, DurationsService, LanguagesService, LocationsService, SourcesService } from '@lectorium/dal/index'

export type EventArgs = { trackId: string } 
export type EventHandler = (event: EventArgs) => Promise<void>

export type Options = {
  authorsService: AuthorsService,
  sourcesService: SourcesService,
  locationsService: LocationsService,
  languagesService: LanguagesService,
  durationsService: DurationsService
}

export function useSearchFiltersDictionaryInitializer(
  options: Options
) {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const searchFiltersDictionaryStore = useSearchFiltersDictionaryStore()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function init() {
    const [
      authors, sources, locations, languages, durations
    ] = await Promise.all([
      options.authorsService.getAll(),
      options.sourcesService.getAll(),
      options.locationsService.getAll(),
      options.languagesService.getAll(),
      options.durationsService.getAll(),
    ])

    searchFiltersDictionaryStore.authors = authors.map((item) => ({
      id: item._id.replace('author::', ''),
      title: item.fullName['en'] || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.sources = sources.map((item) => ({
      id: item._id.replace('source::', ''),
      title: item.fullName['en'] || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.locations = locations.map((item) => ({
      id: item._id.replace('location::', ''),
      title: item.fullName['en'] || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.languages = languages.map((item) => ({
      id: item._id.replace('language::', ''),
      title: item.icon + ' ' + item.fullName,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.durations = durations
      .sort((a, b) => a.minDuration - b.minDuration)
      .map((item) => ({
        id: item._id.replace('duration::', ''),
        title: item.fullName['en'] || item._id,
      }))
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { init }
}