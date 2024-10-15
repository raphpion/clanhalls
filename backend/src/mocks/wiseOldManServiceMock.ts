import type {
  NameChange,
  NameChangesSearchFilter,
  PlayerDetails,
} from '@wise-old-man/utils';

import type {
  IWiseOldManService,
  PaginationOptions,
} from '../services/wiseOldManService';

class WiseOldManServiceMock implements IWiseOldManService {
  public async getPlayerDetails(_: string): Promise<PlayerDetails | undefined> {
    return undefined;
  }

  public async getPlayerDetailsById(
    _: number,
  ): Promise<PlayerDetails | undefined> {
    return undefined;
  }

  public async getPlayerNames(_: string): Promise<NameChange[] | undefined> {
    return undefined;
  }

  public async searchNameChanges(
    _: NameChangesSearchFilter,
    __?: PaginationOptions,
  ): Promise<NameChange[] | undefined> {
    return undefined;
  }
}

export default WiseOldManServiceMock;
