import type {
  NameChange,
  NameChangesSearchFilter,
  PlayerDetails,
} from '@wise-old-man/utils';
import { WOMClient } from '@wise-old-man/utils';
import { inject, injectable } from 'tsyringe';

import type ConfigService from '../config';

export interface IWiseOldManService {
  getPlayerDetails(username: string): Promise<PlayerDetails | undefined>;
  getPlayerDetailsById(id: number): Promise<PlayerDetails | undefined>;
  getPlayerNames(username: string): Promise<NameChange[] | undefined>;
  searchNameChanges(
    filter: NameChangesSearchFilter,
    pagination?: PaginationOptions,
  ): Promise<NameChange[] | undefined>;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

@injectable()
class WiseOldManService implements IWiseOldManService {
  private rateLimitedCounter = 0;

  public constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
  ) {}

  private readonly client: WOMClient = new WOMClient(
    this.configService.get((config) => config.wiseOldMan),
  );

  public async getPlayerDetails(
    username: string,
  ): Promise<PlayerDetails | undefined> {
    return this.withSafeWiseOldMan(() =>
      this.client.players.getPlayerDetails(username),
    );
  }

  public async getPlayerDetailsById(
    id: number,
  ): Promise<PlayerDetails | undefined> {
    return this.withSafeWiseOldMan(() =>
      this.client.players.getPlayerDetailsById(id),
    );
  }

  public async getPlayerNames(
    username: string,
  ): Promise<NameChange[] | undefined> {
    return this.withSafeWiseOldMan(() =>
      this.client.players.getPlayerNames(username),
    );
  }

  public async searchNameChanges(
    filter: NameChangesSearchFilter,
    pagination?: PaginationOptions,
  ): Promise<NameChange[] | undefined> {
    return this.withSafeWiseOldMan(() =>
      this.client.nameChanges.searchNameChanges(filter, pagination),
    );
  }

  private async withSafeWiseOldMan<T>(
    callback: () => Promise<T>,
  ): Promise<T | undefined> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await callback();

        // Reset the rate limited counter if the request is successful
        this.rateLimitedCounter = 0;
      } catch (error) {
        if (error.name === 'NotFoundError') {
          return undefined;
        }

        if (error.name === 'RateLimitError') {
          this.rateLimitedCounter += 1;

          // Retry in 60 seconds plus a delay if the request fails because of rate limiting
          // See https://docs.wiseoldman.net/#rate-limits--api-keys
          await new Promise((r) =>
            setTimeout(r, 60000 + this.rateLimitedCounter),
          );

          continue;
        }

        throw error;
      }
    }
  }
}

export default WiseOldManService;
