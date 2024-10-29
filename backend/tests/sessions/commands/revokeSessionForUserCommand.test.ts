import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import RevokeSessionForUserCommand from '../../../src/sessions/commands/revokeSessionForUserCommand';
import Session from '../../../src/sessions/session';
import User from '../../../src/users/user';

describe('RevokeSessionForUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('revokes a session for the user', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const session = seedingService.getEntity(Session, 'john_doe_01')!;

    await new RevokeSessionForUserCommand({
      userId: user.id,
      uuid: session.uuid,
    }).execute();

    const revokedSession = await db.getRepository(Session).findOne({
      where: { id: session.id },
    });

    expect(revokedSession!.isSignedOut).toBe(true);
  });

  it('throws an error if the session is not owned by the user', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const session = seedingService.getEntity(Session, 'jane_doe_01')!;

    await expect(
      new RevokeSessionForUserCommand({
        userId: user.id,
        uuid: session.uuid,
      }).execute(),
    ).rejects.toThrow();
  });
});
