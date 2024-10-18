import 'reflect-metadata';

// eslint-disable-next-line import/order
import container from '../../../../src/container';

import Clan from '../../../../src/clans/clan';
import CreateSettingsReport from '../../../../src/clans/reports/commands/createSettingsReportCommand';
import type { Settings } from '../../../../src/clans/reports/settingsReport';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import User from '../../../../src/users/user';

describe('CreateSettingsReport', () => {
  const seedingService = container.resolve<SeedingService>('SeedingService');

  const data: Settings = {
    name: 'The Worst Clan',
    ranks: {
      CLAN_RANK_3: 'Onyx',
      CLAN_RANK_8: 'Skulled',
      DEPUTY_OWNER: 'Deputy Owner',
      CLAN_RANK_7: 'Imp',
      GUEST: 'Guest',
      CLAN_RANK_13: 'Captain',
      CLAN_RANK_11: 'TzKal',
      CLAN_RANK_2: 'Dragonstone',
      CLAN_RANK_9: 'Beast',
      CLAN_RANK_14: 'General',
      CLAN_RANK_5: 'Maxed',
      OWNER: 'Owner',
      JMOD: 'Jmod',
      CLAN_RANK_12: 'Lieutenant',
      CLAN_RANK_1: 'Diamond',
      CLAN_RANK_4: 'Zenyte',
      CLAN_RANK_6: 'Gnome Child',
      ADMINISTRATOR: 'Administrator',
      CLAN_RANK_10: 'Legend',
    },
  } as const;

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('creates a settings report', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const clan = seedingService.getEntity(Clan, 'iron_wolves')!;

    const report = await new CreateSettingsReport({
      user,
      clan,
      settings: data,
    }).execute();

    expect(report).not.toBeNull();
    expect(report.data).toEqual(data);
    expect(report.appliedAt).toBeNull();
  });

  it('throws an error if the user is not a member of the clan', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;
    const clan = seedingService.getEntity(Clan, 'night_blades')!;

    await expect(
      new CreateSettingsReport({
        user,
        clan,
        settings: data,
      }).execute(),
    ).rejects.toThrow();
  });
});
