import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import VerifyEmailCommand from '../../../src/users/commands/verifyEmailCommand';
import User from '../../../src/users/user';

describe('VerifyEmailCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('verifies the email if it is not already verified', async () => {
    const user = seedingService.getEntity(User, 'john_doe');

    await new VerifyEmailCommand({
      user: user!,
    }).execute();

    const updatedUser = await db
      .getRepository(User)
      .findOneBy({ id: user!.id });

    expect(updatedUser!.emailVerified).toBe(true);
  });

  it('throws an error if the email is already verified', async () => {
    let user = seedingService.getEntity(User, 'john_doe');

    await new VerifyEmailCommand({
      user: user!,
    }).execute();

    user = await db.getRepository(User).findOneBy({ id: user!.id });

    await expect(
      new VerifyEmailCommand({
        user: user!,
      }).execute(),
    ).rejects.toThrow();
  });
});
