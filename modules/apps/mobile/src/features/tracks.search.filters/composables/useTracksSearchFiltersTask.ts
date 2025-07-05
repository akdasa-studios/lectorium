import { Ref, watch } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { useSearchFiltersDictionaryStore } from './useSearchFiltersDictionaryStore'
import { IDatabaseService } from '@lectorium/dal/index'
import { Author, Source, Location, Language, Duration, SortMethod } from '@lectorium/dal/models'

export type Options = {
  authorsService: IDatabaseService<Author>
  sourcesService: IDatabaseService<Source>
  locationsService: IDatabaseService<Location>
  languagesService: IDatabaseService<Language>
  durationsService: IDatabaseService<Duration>
  sortMethodsService: IDatabaseService<SortMethod>
  language: Ref<string>
}

export const useTracksSearchFiltersTask = createSharedComposable(({
  authorsService,
  sourcesService,
  locationsService,
  languagesService,
  durationsService,
  sortMethodsService,
  language
}: Options) => {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const searchFiltersDictionaryStore = useSearchFiltersDictionaryStore()

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  watch(language, async () => await onRefresh(), { immediate: true })


  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function onRefresh() {
    const [
      authors, sources, locations, languages, durations, sortMethods
    ] = await Promise.all([
      authorsService.getAll(),
      sourcesService.getAll(),
      locationsService.getAll(),
      languagesService.getAll(),
      durationsService.getAll(),
      sortMethodsService.getAll(),
    ])

    searchFiltersDictionaryStore.authors = authors.map((item) => ({
      id: item._id.replace('author::', ''),
      title: item.fullName[language.value] 
             || item.fullName['en']
             || item.fullName[Object.keys(item.fullName)[0]]
             || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.sources = sources.map((item) => ({
      id: item._id.replace('source::', ''),
      title: item.fullName[language.value] 
             || item.fullName['en']
             || item.fullName[Object.keys(item.fullName)[0]]
             || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.locations = locations.map((item) => ({
      id: item._id.replace('location::', ''),
      title: item.fullName[language.value] 
             || item.fullName['en']
             || item.fullName[Object.keys(item.fullName)[0]]
             || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.durations = durations
      .sort((a, b) => a.minDuration - b.minDuration)
      .map((item) => ({
        id: item._id.replace('duration::', ''),
        title: item.fullName[language.value] 
               || item.fullName['en']
               || item.fullName[Object.keys(item.fullName)[0]]
               || item._id,
      }))

    searchFiltersDictionaryStore.sort = sortMethods.map((item) => ({
      id: item._id.replace('sort::', ''),
      title: item.fullName[language.value] 
             || item.fullName['en']
             || item.fullName[Object.keys(item.fullName)[0]]
             || item._id,
    })).sort((a, b) => a.title.localeCompare(b.title))

    searchFiltersDictionaryStore.languages = languages.map((item) => ({
      id: item._id.replace('language::', ''),
      title: item.icon + ' ' + item.fullName,
    })).sort((a, b) => a.title.localeCompare(b.title))
  }
})