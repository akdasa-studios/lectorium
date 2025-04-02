import { createSharedComposable } from "@vueuse/core"
import { SourcesService } from "@lectorium/dal/index"
import { useDatabase } from "@brahma/shared"

export const useSourcesService = createSharedComposable(() => {
  const database = useDatabase()
  return new SourcesService(database.local.dictionary)
})
