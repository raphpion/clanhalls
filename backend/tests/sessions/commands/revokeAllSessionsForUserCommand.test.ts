import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import RevokeAllSessionsForUserCommand from '../../../src/sessions/commands/revokeAllSessionsForUserCommand';
import Session from '../../../src/sessions/session';
import User from '../../../src/users/user';

describe('RevokeAllSessionsForUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('revokes all sessions for the user', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;

    await new RevokeAllSessionsForUserCommand({
      user,
    }).execute();

    const sessions = await db.getRepository(Session).find({
      where: { userId: user.id },
    });

    for (const session of sessions) {
      expect(session.isSignedOut).toBe(true);
    }
  });
});
