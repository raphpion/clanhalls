abstract class Command<TParams, TResult = void> {
  constructor(protected readonly params: TParams) {}

  async execute(): Promise<TResult> {
    return undefined;
  }
}

export default Command;
