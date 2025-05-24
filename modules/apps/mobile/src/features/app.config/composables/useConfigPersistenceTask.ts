import { watch, Ref, toRaw } from 'vue'
import { Storage } from '@ionic/storage'
import { useConfig } from './useConfig'

export function useConfigPersistenceTask() {

  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const config = useConfig()

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const storage = new Storage({ name: 'config' })

  /* -------------------------------------------------------------------------- */
  /*                               Initialization                               */
  /* -------------------------------------------------------------------------- */

  async function start() {
    await storage.create()
    await bind(config.appLanguage, 'app.language', '??')
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Helpers                                  */
  /* -------------------------------------------------------------------------- */

  async function bind<T>(
    config: Ref<T>, 
    key: string, 
    defaultValue: T
  ) {
    config.value = await storage.get(key) || defaultValue
    watch(config, async (value) => {
      await storage.set(key, toRaw(value))
    }, { deep: true })
    console.log(`Bound ${key} to storage: ${config.value}`)
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    start
  }
}