import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import SignOutSessionCommand from '../../../src/sessions/commands/signOutSessionCommand';
import Session from '../../../src/sessions/session';

describe('SignOutSessionCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('revokes a session for the user', async () => {
    const session = seedingService.getEntity(Session, 'john_doe_01')!;

    await new SignOutSessionCommand({
      session,
    }).execute();

    const revokedSession = await db.getRepository(Session).findOne({
      where: { id: session.id },
    });

    expect(revokedSession!.isSignedOut).toBe(true);
  });
});
