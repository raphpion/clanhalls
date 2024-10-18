import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../../src/container';

import ApplySettingsReportDataCommand from '../../../../src/clans/reports/commands/applySettingsReportDataCommand';
import SettingsReport from '../../../../src/clans/reports/settingsReport';
import type SeedingService from '../../../../src/db/seeding/seedingService';

describe('ApplySettingsReportDataCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('updates clan name in game, last synced at date and report applied at date', async () => {
    const report = seedingService.getEntity(
      SettingsReport,
      'iron_wolves__john_doe__02',
    )!;

    await new ApplySettingsReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db
      .getRepository(SettingsReport)
      .findOne({ where: { id: report.id }, relations: ['clan'] });

    expect(appliedReport).not.toBeNull();
    expect(appliedReport!.appliedAt).not.toBeNull();

    const clan = await appliedReport!.clan;
    expect(clan.nameInGame).toBe(appliedReport!.data.name);
    expect(clan.lastSyncedAt).toStrictEqual(appliedReport!.appliedAt);
  });

  it('deletes clan ranks not in use anymore and updates existing modified ones', async () => {
    const report = seedingService.getEntity(
      SettingsReport,
      'iron_wolves__john_doe__03',
    )!;

    await new ApplySettingsReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db.getRepository(SettingsReport).findOne({
      where: { id: report.id },
      relations: ['clan', 'clan.clanRanks'],
    });

    const clan = await appliedReport!.clan;
    const clanRanks = await clan.clanRanks;
    expect(clanRanks).toHaveLength(Object.keys(report.data.ranks).length);

    const modifiedRank1 = clanRanks.find((r) => r.rank === 'CLAN_RANK_12');
    const modifiedRank2 = clanRanks.find((r) => r.rank === 'CLAN_RANK_13');
    const deletedRank = clanRanks.find((r) => r.rank === 'CLAN_RANK_14');

    expect(modifiedRank1).toBeDefined();
    expect(modifiedRank1!.title).toBe('Adventurer');

    expect(modifiedRank2).toBeDefined();
    expect(modifiedRank2!.title).toBe('Moderator');

    expect(deletedRank).not.toBeDefined();
  });

  it('throws an error if the report has already been applied', async () => {
    const report = seedingService.getEntity(
      SettingsReport,
      'iron_wolves__john_doe__01',
    )!;

    await expect(
      new ApplySettingsReportDataCommand({
        reportId: report.id,
      }).execute(),
    ).rejects.toThrow();
  });
});
