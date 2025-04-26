import { useDAL } from '@/app'
import Sqids from 'sqids'

export function useUserSeesSuggestionsScenario() {
  /* -------------------------------------------------------------------------- */
  /*                                Dependencies                                */
  /* -------------------------------------------------------------------------- */

  const dal = useDAL()
  const sqids = new Sqids({ minLength: 10 })

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Fetches a specified number of random track suggestions for the user.
   * @param max - The maximum number of track suggestions to fetch. Defaults to 5.
   * @returns A Promise that resolves to an array of track objects. Any tracks that couldn't be found are filtered out.
   */
  async function execute(max: number = 5) {
    // Get total tracks count
    const totalTracksCount = await dal.tracks.getCount()

    // TODO: make the unique
    // Generate array with random ids -> from 1 to trackScount
    const randomTrackIds = new Set(Array.from(
      { length: max }, 
      () => Math.floor(Math.random() * totalTracksCount) + 1
    )).values()

    console.log(randomTrackIds)

    // Load tracks by that ids, filter out if nothing found
    const tracks = await Promise.all(
      randomTrackIds.map(
        async id => await dal.tracks.findOne({ _id: sqids.encode([id]) })
      )
    )

    // List of tracks
    return tracks.filter(track => track !== undefined)
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { execute }
  
}