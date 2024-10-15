import type { DataSource } from 'typeorm';

import container from './container';

abstract class Query<TParams, TResult> {
  protected readonly db: DataSource = container.resolve('DataSource');

  constructor(protected readonly params: TParams) {}

  async execute(): Promise<TResult> {
    return undefined;
  }
}

export default Query;
