import type { DefaultJobOptions } from 'bullmq';

export type JobClass<T> = new () => Job<T>;

abstract class Job<T> {
  private _name: string;
  private _options: DefaultJobOptions = {};

  constructor() {
    this._name = this.constructor.name;
    this._options = {};
  }

  public get name(): string {
    return this._name;
  }

  public get options(): DefaultJobOptions {
    return this._options;
  }

  async execute(_payload: T): Promise<void> {}
  async onSuccess(_payload: T): Promise<void> {}
  async onFailure(_payload: T, _error: Error): Promise<void> {}
}

export default Job;
