import { usePlayer, usePlayerControls } from '@lectorium/mobile/player'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export function usePlayerControlsPlayerScenario() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const player = usePlayer()
  const playerControls = usePlayerControls()

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  async function togglePause() {
    await player.togglePause()
    await Haptics.impact({ style: ImpactStyle.Light })
    playerControls.isPlaying.value = !playerControls.isPlaying.value
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return {
    togglePause
  }
}