
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area'

export function useSafeAreaTask() {

  /* -------------------------------------------------------------------------- */
  /*                               Initialization                               */
  /* -------------------------------------------------------------------------- */

  
  async function start() {
    const insets = await SafeArea.getSafeAreaInsets()
    applyInsets(insets)
    await SafeArea.addListener('safeAreaChanged', (data) => {
      applyInsets(data)
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Helpers                                  */
  /* -------------------------------------------------------------------------- */

  function applyInsets(data: SafeAreaInsets) {
    for (const [key, value] of Object.entries(data.insets)) {
      document.documentElement.style.setProperty(
        `--ion-safe-area-${key}`,
        `${value}px`,
      )
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    start,
  }
}
