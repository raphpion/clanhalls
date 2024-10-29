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
  private readonly details: PlayerDetails[] = [
    {
      username: 'i am john',
      displayName: 'I am John',
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
      username: 'jane smiths',
      displayName: 'Jane Smiths',
      combatLevel: 3,
      archive: null,
      latestSnapshot: undefined,
      id: 1,
      type: 'ironman',
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
      username: 'mikeross',
      displayName: 'MikeRoss',
      combatLevel: 3,
      archive: null,
      latestSnapshot: undefined,
      id: 2,
      type: 'ironman',
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
      playerId: 1,
      oldName: 'JaneSmith',
      newName: 'Jane Smiths',
      status: 'approved',
      createdAt: new Date('2024-02-26'),
      updatedAt: new Date('2024-02-26'),
      resolvedAt: new Date('2024-02-26'),
      reviewContext: null,
    },
    {
      id: 1,
      playerId: 0,
      oldName: 'JohnDoe',
      newName: 'I am John',
      status: 'approved',
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
      resolvedAt: new Date('2024-02-28'),
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

  public async getPlayerNames(
    username: string,
  ): Promise<NameChange[] | undefined> {
    const player = this.details.find((d) => d.username === username);
    if (!player) return undefined;

    return this.nameChanges.filter((nc) => nc.playerId === player.id);
  }

  public async searchNameChanges(
    filter: NameChangesSearchFilter,
    pagination?: PaginationOptions,
  ): Promise<NameChange[] | undefined> {
    const filteredList = this.nameChanges.filter((nc) => {
      if (filter.username) {
        const trimmedNames = [nc.oldName, nc.newName].map(this.trimUsername);
        const trimmedUsername = this.trimUsername(filter.username);
        if (!trimmedNames.some((n) => n.includes(trimmedUsername))) {
          return false;
        }
      }

      if (filter.status && nc.status !== filter.status) {
        return false;
      }

      return true;
    });

    if (!pagination) return filteredList;

    const offset = pagination.offset || 0;
    const limit = pagination.limit || filteredList.length;

    return filteredList.slice(offset, limit);
  }

  private trimUsername(username: string): string {
    return username.replace(/ /g, '').toLowerCase();
  }
}

export default WiseOldManServiceMock;
