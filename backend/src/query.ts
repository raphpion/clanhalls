abstract class Query<TParams, TResult> {
  constructor(protected readonly params: TParams) {}

  async execute(): Promise<TResult> {
    return undefined;
  }
}

export default Query;
