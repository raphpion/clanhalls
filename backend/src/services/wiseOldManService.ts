import type {
  NameChange,
  NameChangesSearchFilter,
  PlayerDetails,
} from '@wise-old-man/utils';
import { WOMClient } from '@wise-old-man/utils';
import { injectable } from 'tsyringe';

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
  private readonly client: WOMClient = new WOMClient();

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
        return await callback();
      } catch (error) {
        if (error.name === 'NotFoundError') {
          return undefined;
        }

        if (error.name === 'RateLimitError') {
          // Retry in 60 seconds if the request fails because of rate limiting
          // See https://docs.wiseoldman.net/#rate-limits--api-keys
          await new Promise((r) => setTimeout(r, 60000));
          continue;
        }

        throw error;
      }
    }
  }
}

export default WiseOldManService;
