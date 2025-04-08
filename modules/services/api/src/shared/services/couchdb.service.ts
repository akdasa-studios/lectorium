import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CouchDbConfig } from '@lectorium/api/configs';
import nano from 'nano';

@Injectable()
export class CouchDbService {
  private readonly logger = new Logger(CouchDbService.name);
  private readonly couchDbClient: nano.ServerScope;
  private readonly database: nano.DocumentScope<any>;

  constructor(
    @Inject(CouchDbConfig.KEY)
    config: ConfigType<typeof CouchDbConfig>,
  ) {
    // @ts-ignore
    this.couchDbClient = nano(config.host + ':' + config.port.toString());
  }

  async getById<TEntity>(
    collection: string,
    id: string,
  ): Promise<TEntity | null> {
    try {
      this.couchDbClient.use(collection);
      const document = await this.database.get(id);
      return document as TEntity;
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.warn(`Document with ID ${id} not found.`);
        return null;
      }
      this.logger.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  }
}
