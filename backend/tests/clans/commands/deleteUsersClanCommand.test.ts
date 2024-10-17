import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';

import Clan from '../../../src/clans/clan';
import ClanUser from '../../../src/clans/clanUser';
import DeleteUsersClanCommand from '../../../src/clans/commands/deleteUsersClanCommand';
import type SeedingService from '../../../src/db/seeding/seedingService';
import User from '../../../src/users/user';

describe('DeleteUsersClanCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('deletes the clan and removes all users from it', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const clan = seedingService.getEntity(Clan, 'iron_wolves')!;

    await new DeleteUsersClanCommand({ user }).execute();

    const deletedClan = await db.getRepository(Clan).findOneBy({ id: clan.id });
    expect(deletedClan).toBeNull();

    const clanUsers = await db
      .getRepository(ClanUser)
      .findBy({ clanId: clan.id });
    expect(clanUsers).toHaveLength(0);
  });

  it('throws an error if the user does not have a clan', async () => {
    const user = seedingService.getEntity(User, 'james_taylor')!;

    await expect(
      new DeleteUsersClanCommand({ user }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the user is not an admin in the clan', async () => {
    const user = seedingService.getEntity(User, 'jane_doe')!;

    await expect(
      new DeleteUsersClanCommand({ user }).execute(),
    ).rejects.toThrow();
  });
});
