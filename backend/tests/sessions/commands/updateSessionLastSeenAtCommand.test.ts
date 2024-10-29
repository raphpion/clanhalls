import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import UpdateSessionLastSeenAt from '../../../src/sessions/commands/updateSessionLastSeenAtCommand';
import Session from '../../../src/sessions/session';

describe('UpdateSessionLastSeenAt', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('updates the last seen at date of a session', async () => {
    const session = seedingService.getEntity(Session, 'john_doe_04')!;

    await new UpdateSessionLastSeenAt({
      uuid: session.uuid,
    }).execute();

    const updatedSession = await db.getRepository(Session).findOne({
      where: { id: session.id },
    });

    expect(updatedSession?.lastSeenAt).not.toStrictEqual(session.lastSeenAt);
  });
});
