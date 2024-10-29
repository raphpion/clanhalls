import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import AssociatePlayerToWiseOldManCommand from '../../../src/players/commands/associatePlayerToWiseOldManCommand';
import Player from '../../../src/players/player';

describe('AssociatePlayerToWiseOldManCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('updates player wiseOldManId if it is found on WiseOldMan', async () => {
    const player = seedingService.getEntity(Player, 'mike_ross')!;

    await new AssociatePlayerToWiseOldManCommand({
      player,
    }).execute();

    const updatedPlayer = await db.getRepository(Player).findOne({
      where: { id: player.id },
    });

    expect(updatedPlayer!.wiseOldManId).not.toBeNull();
  });
});
