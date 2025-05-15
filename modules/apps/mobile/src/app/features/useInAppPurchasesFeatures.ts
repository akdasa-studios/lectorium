import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'
import { ENVIRONMENT } from '@lectorium/mobile/app/env'

export function useInAppPurchasesFeatures() {

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  
  async function init() {
    if (Capacitor.getPlatform() === 'web') {
      return
    }

    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })
    await Purchases.configure({
      apiKey: Capacitor.getPlatform() === 'ios' 
        ? ENVIRONMENT.appleRevenueCatKey 
        : ENVIRONMENT.googleRevenueCatKey,
    })
    console.log('RevenueCat SDK configured!')
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { init }
}