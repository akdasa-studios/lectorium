import { Connection, Event } from '@lectorium/mobile/features/app.core'

export const Events = {
  /* -------------------------------------------------------------------------- */
  /*                                    Sync                                    */
  /* -------------------------------------------------------------------------- */

  syncRequested: new Event<void>('syncRequested'),
  syncTaskCompleted: new Event<{ task: 'commonData' | 'userData' | 'media' }>('syncTaskCompleted'),
  
  /* -------------------------------------------------------------------------- */
  /*                               Track Downloads                              */
  /* -------------------------------------------------------------------------- */
  
  trackDownload: new Event<{ trackId: string[] }>('trackDownload'),

  /* -------------------------------------------------------------------------- */
  /*                                  Playlist                                  */
  /* -------------------------------------------------------------------------- */

  playTrackRequested: new Event<{ playlistItemId: string }>('playTrackRequested'),
  playlistUpdateRequested: new Event<{ language: string }>('playlistUpdateRequested'),

  /* -------------------------------------------------------------------------- */
  /*                                    Notes                                   */
  /* -------------------------------------------------------------------------- */

  notesUpdateRequested: new Event<void>('notesUpdateRequested'),

  /* -------------------------------------------------------------------------- */
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  restoreSubscriptionPlanRequested: new Event<void>('restoreSubscriptionPlanRequested'),

  /* -------------------------------------------------------------------------- */
  /*                               Authentication                               */
  /* -------------------------------------------------------------------------- */

  authenticationRequestedEvent: new Event<{ provider: string }>('authenticationRequestedEvent'),
  logOutRequestedEvent: new Event<void>('logOutRequestedEvent'),
}

export const Slots = {
  getDownloaderTasks: new Connection<Array<{ url: string, destination: string, progress: number, meta: any }>>(),
}