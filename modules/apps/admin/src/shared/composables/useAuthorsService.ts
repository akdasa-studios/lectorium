import { createSharedComposable } from "@vueuse/core"
import { AuthorsService } from "@lectorium/dal/index"
import { useDatabase } from "@brahma/shared"

export const useAuthorsService = createSharedComposable(() => {
  const database = useDatabase()
  return new AuthorsService(database.local.dictionary)
})
