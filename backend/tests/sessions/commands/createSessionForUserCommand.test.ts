import 'reflect-metadata';
import { addDays } from 'date-fns';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import CreateSessionForUserCommand from '../../../src/sessions/commands/createSessionForUserCommand';
import Session from '../../../src/sessions/session';
import User from '../../../src/users/user';

describe('CreateSessionForUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('creates a session for the user that is not signed out and expires in 2 weeks', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const sessionId = 'session-id';

    await new CreateSessionForUserCommand({
      user,
      sessionId,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      method: 'method',
      ip: '::1',
    }).execute();

    const session = await db.getRepository(Session).findOne({
      where: { sessionID: sessionId },
    });

    expect(session).not.toBeNull();
    expect(session!.isSignedOut).toBe(false);
    expect(session!.expiresAt.getTime()).toBeGreaterThan(
      // we use 13 days to give ourselves a buffer before creationDate is set at save, expiration date is set at creation
      addDays(new Date(), 13).getTime(),
    );
  });
});
