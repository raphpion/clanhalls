import type {
  NameChange,
  NameChangesSearchFilter,
  PlayerDetails,
} from '@wise-old-man/utils';
import { subYears } from 'date-fns';

import type {
  IWiseOldManService,
  PaginationOptions,
} from '../services/wiseOldManService';

class WiseOldManServiceMock implements IWiseOldManService {
  private readonly details: PlayerDetails[] = [
    {
      username: 'johndoe',
      displayName: 'JohnDoe',
      combatLevel: 3,
      archive: null,
      latestSnapshot: undefined,
      id: 0,
      type: 'regular',
      build: 'main',
      status: 'active',
      country: 'AD',
      patron: false,
      ehp: 0,
      ehb: 0,
      ttm: 0,
      tt200m: 0,
      registeredAt: undefined,
      updatedAt: undefined,
      lastChangedAt: undefined,
      lastImportedAt: undefined,
      exp: 0,
    },
    {
      username: 'janedoe',
      displayName: 'JaneDoe',
      combatLevel: 3,
      archive: null,
      latestSnapshot: undefined,
      id: 1,
      type: 'regular',
      build: 'main',
      status: 'active',
      country: 'AD',
      patron: false,
      ehp: 0,
      ehb: 0,
      ttm: 0,
      tt200m: 0,
      registeredAt: undefined,
      updatedAt: undefined,
      lastChangedAt: undefined,
      lastImportedAt: undefined,
      exp: 0,
    },
    {
      username: 'jacksmith',
      displayName: 'JackSmith',
      combatLevel: 3,
      archive: null,
      latestSnapshot: undefined,
      id: 2,
      type: 'regular',
      build: 'main',
      status: 'active',
      country: 'AD',
      patron: false,
      ehp: 0,
      ehb: 0,
      ttm: 0,
      tt200m: 0,
      registeredAt: undefined,
      updatedAt: undefined,
      lastChangedAt: undefined,
      lastImportedAt: undefined,
      exp: 0,
    },
  ];

  private readonly nameChanges: NameChange[] = [
    {
      id: 0,
      playerId: 0,
      oldName: 'I am John',
      newName: 'JohnDoe',
      status: 'approved',
      createdAt: subYears(new Date(), 1),
      updatedAt: subYears(new Date(), 1),
      resolvedAt: subYears(new Date(), 1),
      reviewContext: null,
    },
  ];

  public async getPlayerDetails(
    username: string,
  ): Promise<PlayerDetails | undefined> {
    return this.details.find((d) => d.username === username);
  }

  public async getPlayerDetailsById(
    id: number,
  ): Promise<PlayerDetails | undefined> {
    return this.details.find((d) => d.id === id);
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
