import 'reflect-metadata';

// eslint-disable-next-line import/order
import container from '../../../../src/container';

import Clan from '../../../../src/clans/clan';
import CreateMembersListReportCommand from '../../../../src/clans/reports/commands/createMembersListReportCommand';
import type { ListMember } from '../../../../src/clans/reports/membersListReport';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import User from '../../../../src/users/user';

describe('CreateMembersListReportCommand', () => {
  const seedingService = container.resolve<SeedingService>('SeedingService');

  const data: ListMember[] = [
    {
      name: 'JohnDoe',
      rank: 126,
    },
    {
      name: 'JaneDoe',
      rank: 125,
    },
    {
      name: 'JackSmith',
      rank: 0,
    },
  ] as const;

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('creates a member activity report', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const clan = seedingService.getEntity(Clan, 'iron_wolves')!;

    const report = await new CreateMembersListReportCommand({
      user,
      clan,
      members: data,
    }).execute();

    expect(report).not.toBeNull();
  });

  it('throws an error if the user is not a member of the clan', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const clan = seedingService.getEntity(Clan, 'night_blades')!;

    await expect(
      new CreateMembersListReportCommand({
        user,
        clan,
        members: data,
      }).execute(),
    ).rejects.toThrow();
  });
});
