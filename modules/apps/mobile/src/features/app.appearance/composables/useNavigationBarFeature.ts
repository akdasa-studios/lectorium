import { watch } from 'vue'
import { NavigationBar } from '@squareetlabs/capacitor-navigation-bar'
import { Capacitor } from '@capacitor/core'
import { usePlayerTranscript } from '@lectorium/mobile/features/player'
import { watchPausable } from '@vueuse/core'

export function useNavigationBarTask() {
  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const { isOpen: isPlayerPageOpen } = usePlayerTranscript()

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const hook = watchPausable(isPlayerPageOpen, async (value) => {
    if (value) {
      await NavigationBar.setColor({ color: '#833ad4', darkButtons: false })
    } else {
      await NavigationBar.setColor({ color: '#ffffff', darkButtons: true })
    }
  }, { initialState: 'paused' })

  /* -------------------------------------------------------------------------- */
  /*                               Initialization                               */
  /* -------------------------------------------------------------------------- */
  
  async function start() {
    if (Capacitor.getPlatform() !== 'android') { return }
    
    await NavigationBar.setColor({ color: '#ffffff', darkButtons: true })
    await NavigationBar.setTransparency({ isTransparent: true })
    hook.resume()
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Interf                                   */
  /* -------------------------------------------------------------------------- */

  return {
    start
  }
}