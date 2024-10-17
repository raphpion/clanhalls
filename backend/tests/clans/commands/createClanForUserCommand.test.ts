import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';

import Clan from '../../../src/clans/clan';
import ClanUser from '../../../src/clans/clanUser';
import CreateClanForUserCommand from '../../../src/clans/commands/createClanForUserCommand';
import type SeedingService from '../../../src/db/seeding/seedingService';
import User from '../../../src/users/user';

describe('CreateClanForUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('creates a clan and adds the user to it as an admin', async () => {
    const user = seedingService.getEntity(User, 'james_taylor')!;

    await new CreateClanForUserCommand({
      name: 'Steelwill',
      user,
    }).execute();

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'Steelwill',
    });
    expect(clan).not.toBeNull();

    const clanUser = await db
      .getRepository(ClanUser)
      .findOneByOrFail({ userId: user.id, clanId: clan.id });
    expect(clanUser).not.toBeNull();
    expect(clanUser.isAdmin).toBe(true);
  });

  it('throws an error if the name or normalized name is already in use', async () => {
    const user = seedingService.getEntity(User, 'james_taylor')!;

    await expect(
      new CreateClanForUserCommand({
        name: 'Iron Wolves',
        user,
      }).execute(),
    ).rejects.toThrow();

    await expect(
      new CreateClanForUserCommand({
        name: 'Iron Wolves!*',
        user,
      }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the user is already in a clan', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;

    await expect(
      new CreateClanForUserCommand({
        name: 'The Best Clan',
        user,
      }).execute(),
    ).rejects.toThrow();
  });
});
