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
    ranks: [
      { rank: 0, title: 'Diamond' },
      { rank: 10, title: 'Dragonstone' },
      { rank: 20, title: 'Onyx' },
      { rank: 30, title: 'Zenyte' },
      { rank: 40, title: 'Maxed' },
      { rank: 50, title: 'Gnome Child' },
      { rank: 60, title: 'Skulled' },
      { rank: 70, title: 'Imp' },
      { rank: 80, title: 'Beast' },
      { rank: 90, title: 'Legend' },
      { rank: 95, title: 'TzKal' },
      { rank: 115, title: 'Lieutenant' },
      { rank: 120, title: 'Captain' },
      { rank: 124, title: 'General' },
    ],
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
