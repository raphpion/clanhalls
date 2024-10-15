import type { DataSource } from 'typeorm';

import container from './container';

abstract class Command<TParams, TResult = void> {
  protected readonly db: DataSource = container.resolve('DataSource');

  constructor(protected readonly params: TParams) {}

  async execute(): Promise<TResult> {
    return undefined;
  }
}

export default Command;
