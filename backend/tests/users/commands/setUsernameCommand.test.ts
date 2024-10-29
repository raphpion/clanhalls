import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import SetUsernameCommand from '../../../src/users/commands/setUsernameCommand';
import User from '../../../src/users/user';

describe('SetUsernameCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('sets username and username normalized', async () => {
    const user = seedingService.getEntity(User, 'no_username')!;

    await new SetUsernameCommand({
      user,
      username: 'New user',
    }).execute();

    const updatedUser = await db.getRepository(User).findOneBy({ id: user.id });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.username).toBe('New user');
    expect(updatedUser!.usernameNormalized).toBe('new user');
  });

  it('throws an error if username is already taken', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;

    await expect(
      new SetUsernameCommand({
        user,
        username: 'New name',
      }).execute(),
    ).rejects.toThrow();
  });
});
