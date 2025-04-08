import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthConfig } from '@lectorium/api/configs';
import { RedisService } from '@lectorium/api/shared/services';

export type LoginField = 'email' | 'phone';

@Injectable()
export class AuthUsersService {
  private readonly logger = new Logger(AuthUsersService.name);

  /**
   * Creates an instance of AuthUsersService.
   * @param users Users repository
   * @param roles Rples repository
   * @param mapper Mapper instance
   */
  constructor(
    private readonly redis: RedisService,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  /**
   * Finds a user by id.
   * @param id Id of the user
   * @returns User with the given id or null if not found
   */
  async findById(id: string): Promise<{ id: string } | null> {
    // TODO: get user by id from database
    return await Promise.resolve({ id });
    // return await this.users.findOne({ where: { id }, relations: ['roles'] });
  }
}
