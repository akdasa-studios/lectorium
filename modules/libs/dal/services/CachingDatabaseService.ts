import { DatabaseService } from './DatabaseService'
import { FindOneRequest, GetAllRequest, GetManyRequest, IDatabaseService, Identifiable, ItemChangedEvent, ItemChangedEventHandler } from './IDatabaseService'

export class CachingDatabaseService<
  TItem extends Identifiable,
  TDbScheme extends Identifiable,
> implements IDatabaseService<TItem, TDbScheme> {
  private _cacheAllLoaded: boolean = false
  private _cache: Map<string, TItem> = new Map()

  constructor(
    private readonly wrappedService: DatabaseService<TItem, TDbScheme>
  ) {
  }

  public subscribe(
    handler: ItemChangedEventHandler<TItem>
  ) {
    this.wrappedService.subscribe(handler)
  }

  private generateCacheKey(obj: any): string {
    return JSON.stringify(obj)
  }

  async getOne(
    id: string
  ): Promise<TItem> {
    const cacheKey = this.generateCacheKey(id)
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)! 
    }

    const result = await this.wrappedService.getOne(id)
    if (result) { 
      this._cache.set(cacheKey, result) 
    }
    return result
  }

  async findOne(
    request: FindOneRequest<TDbScheme>
  ): Promise<TItem | undefined> {
    return this.wrappedService.findOne(request)
  }

  async getAll(
    request?: GetAllRequest
  ): Promise<TItem[]> {
    if (!this._cacheAllLoaded) {
      const items = await this.wrappedService.getAll(request)
      for (const item of items) {
        const cacheKey = this.generateCacheKey(item._id)
        this._cache.set(cacheKey, item)
      }
      this._cacheAllLoaded = true
      return items
    }
    return Array.from(this._cache.values())
  }

  async getMany(
    request: GetManyRequest
  ): Promise<TItem[]> {
    return this.wrappedService.getMany(request)
  }

  async getIds(
    request: GetManyRequest
  ): Promise<string[]> {
    return this.wrappedService.getIds(request)
  }

  async getCount(): Promise<number> {
    return this.wrappedService.getCount()
  }

  async addOne(
    item: TItem
  ): Promise<void> {
    return this.wrappedService.addOne(item)
  }

  async updateOne(
    id: string,
    item: TItem
  ): Promise<void> {
    return this.wrappedService.updateOne(id, item)
  }

  async patchOne(
    id: string,
    item: Partial<TItem>
  ): Promise<void> {
    return this.wrappedService.patchOne(id, item)
  }


  async removeOne(
    id: string
  ): Promise<void> {
    return this.wrappedService.removeOne(id)
  }
}
