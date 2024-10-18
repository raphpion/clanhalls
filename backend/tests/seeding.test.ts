import 'reflect-metadata';

// eslint-disable-next-line import/order
import container from '../src/container';

import { readFile } from 'fs/promises';
import { join } from 'path';

import YAML from 'yaml';

import Clan from '../src/clans/clan';
import ClanPlayer from '../src/clans/clanPlayer';
import ClanRank from '../src/clans/clanRank';
import ClanUser from '../src/clans/clanUser';
import SettingsReport from '../src/clans/reports/settingsReport';
import type SeedingService from '../src/db/seeding/seedingService';
import Player from '../src/players/player';
import User from '../src/users/user';

describe('Seeding', () => {
  const seedingService = container.resolve<SeedingService>('SeedingService');
  const testSeedPath = join(__dirname, '../src/db/seeding/test');

  const getSeedData = async (entity: string): Promise<object> => {
    const path = join(testSeedPath, `${entity}.yml`);
    const data = await readFile(path, 'utf-8');
    return YAML.parse(data);
  };

  beforeAll(async () => {
    await seedingService.initialize();
  });

  afterAll(() => {
    seedingService.clear();
  });

  it('seeds clans successfully', async () => {
    for (const key in await getSeedData('clan')) {
      const entity = seedingService.getEntity(Clan, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds users successfully', async () => {
    for (const key in await getSeedData('user')) {
      const entity = seedingService.getEntity(User, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds players successfully', async () => {
    for (const key in await getSeedData('player')) {
      const entity = seedingService.getEntity(Player, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds clan players successfully', async () => {
    for (const key in await getSeedData('clan-player')) {
      const entity = seedingService.getEntity(ClanPlayer, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds clan ranks successfully', async () => {
    for (const key in await getSeedData('clan-rank')) {
      const entity = seedingService.getEntity(ClanRank, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds clan users successfully', async () => {
    for (const key in await getSeedData('clan-user')) {
      const entity = seedingService.getEntity(ClanUser, key);
      expect(entity).not.toBeNull();
    }
  });

  it('seeds settings reports successfully', async () => {
    for (const key in await getSeedData('settings-report')) {
      const entity = seedingService.getEntity(SettingsReport, key);
      expect(entity).not.toBeNull();
    }
  });
});
