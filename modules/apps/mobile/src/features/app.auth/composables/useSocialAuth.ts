import { SocialLogin } from '@capgo/capacitor-social-login'
import { ENVIRONMENT } from '@lectorium/mobile/env'

export function useSocialAuth() {
  async function init() {
    try {
      SocialLogin.initialize({
        google: {
          webClientId: ENVIRONMENT.googleWebClientId,
          iOSClientId: ENVIRONMENT.iOSClientId,
        }
      })
    } catch (e: any) {
      console.error(`Unable to initialize social auth: ${e}`)
    }
  }

  return { init }
}