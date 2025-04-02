import { createSharedComposable } from "@vueuse/core"
import { useDatabase } from "@brahma/shared"
import { LocationsService } from "@lectorium/dal/index"

export const useLocationsService = createSharedComposable(() =>{
  const database = useDatabase()
  return new LocationsService(database.local.dictionary)
})
