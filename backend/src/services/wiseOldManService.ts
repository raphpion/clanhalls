import type {
  NameChange,
  NameChangesSearchFilter,
  PlayerDetails,
} from '@wise-old-man/utils';
import { WOMClient } from '@wise-old-man/utils';
import { inject, injectable } from 'tsyringe';

import type { ILoggerService } from './loggerService';
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

type QueueItem<T> = {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

const LOGGER_NAME = 'WiseOldManService';

@injectable()
class WiseOldManService implements IWiseOldManService {
  private queue: QueueItem<unknown>[] = [];
  private processing = false;
  private rateLimited = false;

  public constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
    @inject('LoggerService') private readonly loggerService: ILoggerService,
  ) {}

  private readonly client: WOMClient = new WOMClient(
    this.configService.get((config) => config.wiseOldMan),
  );

  public async getPlayerDetails(
    username: string,
  ): Promise<PlayerDetails | undefined> {
    return this.enqueueRequest(() =>
      this.client.players.getPlayerDetails(username),
    );
  }

  public async getPlayerDetailsById(
    id: number,
  ): Promise<PlayerDetails | undefined> {
    return this.enqueueRequest(() =>
      this.client.players.getPlayerDetailsById(id),
    );
  }

  public async getPlayerNames(
    username: string,
  ): Promise<NameChange[] | undefined> {
    return this.enqueueRequest(() =>
      this.client.players.getPlayerNames(username),
    );
  }

  public async searchNameChanges(
    filter: NameChangesSearchFilter,
    pagination?: PaginationOptions,
  ): Promise<NameChange[] | undefined> {
    return this.enqueueRequest(() =>
      this.client.nameChanges.searchNameChanges(filter, pagination),
    );
  }

  private enqueueRequest<T>(callback: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ execute: callback, resolve, reject });
      this.loggerService.logService(
        'info',
        LOGGER_NAME,
        `Enqueued request, queue length: ${this.queue.length}`,
      );
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.rateLimited) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const { execute, resolve, reject } = this.queue.shift()!;

      try {
        const result = await execute();
        resolve(result);
        this.loggerService.logService(
          'info',
          LOGGER_NAME,
          `Request resolved, queue length: ${this.queue.length}`,
        );
      } catch (error) {
        if (error.name === 'NotFoundError') {
          resolve(undefined);
        } else if (error.name === 'RateLimitError') {
          this.rateLimited = true;
          this.loggerService.logService(
            'info',
            LOGGER_NAME,
            'Rate limited, pausing requests for 60 seconds.',
          );

          await new Promise((r) => setTimeout(r, 60000));
          this.rateLimited = false;

          // Re-add the failed request to the front of the queue
          this.queue.unshift({ execute, resolve, reject });
        } else {
          reject(error);
        }
      }
    }

    this.processing = false;
  }
}

export default WiseOldManService;
