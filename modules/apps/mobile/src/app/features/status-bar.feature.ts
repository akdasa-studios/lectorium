import { StatusBar, Animation } from '@capacitor/status-bar'

export async function initStatusBarFeature() {
  await StatusBar.hide({ animation: Animation.None })
}