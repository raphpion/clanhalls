import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import UpdateUserCommand from '../../../src/users/commands/updateUserCommand';
import User from '../../../src/users/user';

describe('UpdateUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('should update the user fields', async () => {
    const updates: Partial<User> = {
      pictureUrl: 'https://update.picture.please.com/',
      emailVerified: true,
    };

    const user = seedingService.getEntity(User, 'john_doe');

    await new UpdateUserCommand({
      user: user!,
      updates,
    }).execute();

    const updatedUser = await db
      .getRepository(User)
      .findOneBy({ id: user!.id });

    for (const [key, value] of Object.entries(updates)) {
      expect(updatedUser![key as keyof User]).toBe(value);
    }
  });
});
