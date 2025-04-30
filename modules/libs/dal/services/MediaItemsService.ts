import type { MediaItem } from '../models'
import { Database } from '../persistence'
import { DatabaseService } from './DatabaseService'

/**
 * Schema of the MediaItem documents in the userData collection.
 */
type MediaItemDBSchema = {
  _id: string
  type: "mediaItem"
  title: string
  remoteUrl: string
  localPath: string
  trackId: string,
  taskId: string
  taskStatus: 'pending' | 'running' | 'successful' | 'failed' | 'paused'
}

const mediaItemSerializer = (item: MediaItem): MediaItemDBSchema => item
const mediaItemDeserializer = (document: MediaItemDBSchema): MediaItem => document


/**
 * Service for managing MediaItems
 */
export class MediaItemsService 
  extends DatabaseService<
    MediaItem, 
    MediaItemDBSchema
  > {
  
  /**
   * Constructs a new instance of the MediaItemsService class.
   * @param database The database instance to be used for data operations.
   */
  constructor(
    database: Database
  ) {
    super(
      database, 
      mediaItemSerializer, 
      mediaItemDeserializer, 
      { type: "mediaItem" },
      [
        { name: "taskStatus", fields: [ "taskStatus" ] },
        { name: "trackId", fields: ["trackId"] }
      ])
  }

  /**
   * Gets all media items in the specified states.
   * @param states States to filter by
   * @returns List of media items in the specified states
   */
  async getInState(
    states: MediaItem['taskStatus'][]
  ): Promise<MediaItem[]> {
    return await this.getMany({
      selector: {
        taskStatus: { $in: states }
      }
    })
  }
}
