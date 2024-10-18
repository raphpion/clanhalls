import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../../src/container';

import ApplyMemberActivityReportDataCommand from '../../../../src/clans/reports/commands/applyMemberActivityReportDataCommand';
import MemberActivityReport from '../../../../src/clans/reports/memberActivityReport';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import Player from '../../../../src/players/player';

describe('ApplyMemberActivityReportDataCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('updates existing clan players last seen at and rank', async () => {
    const report = seedingService.getEntity(
      MemberActivityReport,
      'iron_wolves__john_doe__02',
    )!;

    await new ApplyMemberActivityReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db.getRepository(MemberActivityReport).findOne({
      where: { id: report.id },
      relations: ['clan', 'clan.clanPlayers', 'clan.clanPlayers.player'],
    });

    expect(appliedReport).not.toBeNull();
    expect(appliedReport!.appliedAt).not.toBeNull();

    const clan = await appliedReport!.clan;
    const clanPlayers = await clan.clanPlayers;

    for (const clanPlayer of clanPlayers) {
      const player = await clanPlayer.player;
      const reportMember = appliedReport!.data.find(
        (member) => member.name === player.username,
      );

      if (!reportMember) {
        expect(clanPlayer.lastSeenAt).not.toStrictEqual(
          appliedReport!.appliedAt,
        );
        continue;
      }

      expect(clanPlayer.lastSeenAt).toStrictEqual(appliedReport!.receivedAt);
      expect(clanPlayer.rank).toBe(reportMember.rank);
    }
  });

  it('creates new clan players and players for members not present in the clan', async () => {
    const report = seedingService.getEntity(
      MemberActivityReport,
      'iron_wolves__john_doe__03',
    )!;

    const clan = await report.clan;
    const clanPlayers = await clan.clanPlayers;
    const players = await Promise.all(clanPlayers.map((cp) => cp.player));
    const previousLength = clanPlayers.length;
    const newMembers = report.data.filter(
      (m) => !players.some((p) => p.username === m.name),
    );

    // * This new length assumes no players have changed their name or have been removed from the clan
    const expectedNewLength = previousLength + newMembers.length;

    await new ApplyMemberActivityReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db.getRepository(MemberActivityReport).findOne({
      where: { id: report.id },
      relations: ['clan', 'clan.clanPlayers', 'clan.clanPlayers.player'],
    });

    expect(appliedReport).not.toBeNull();
    expect(appliedReport!.appliedAt).not.toBeNull();

    const newClanPlayers = await db.getRepository('ClanPlayer').find({
      where: { clanId: clan.id },
      relations: ['player'],
    });

    const newPlayers = await Promise.all(newClanPlayers.map((cp) => cp.player));

    expect(newClanPlayers).toHaveLength(expectedNewLength);
    for (const member of newMembers) {
      const player = newPlayers.find((p) => p.username === member.name);
      expect(player).not.toBeNull();
      expect(player!.username).toBe(member.name);
    }
  });

  it('updates existing players, adds wise old man id if not present, in case they have changed their name', async () => {
    const report = seedingService.getEntity(
      MemberActivityReport,
      'iron_wolves__john_doe__04',
    )!;

    const johnDoe = seedingService.getEntity(Player, 'john_doe')!;
    const janeSmith = seedingService.getEntity(Player, 'jane_smith')!;

    await new ApplyMemberActivityReportDataCommand({
      reportId: report.id,
    }).execute();

    const johnDoeAfter = await db
      .getRepository(Player)
      .findOneBy({ id: johnDoe.id });
    expect(johnDoeAfter?.username).toBe('I am John');

    const janeSmithAfter = await db
      .getRepository(Player)
      .findOneBy({ id: janeSmith.id });
    expect(janeSmithAfter?.wiseOldManId).not.toBeNull();
    expect(janeSmithAfter?.username).toBe('Jane Smiths');
  });

  it('throws an error if the report has already been applied', async () => {
    const report = seedingService.getEntity(
      MemberActivityReport,
      'iron_wolves__john_doe__01',
    )!;

    await expect(
      new ApplyMemberActivityReportDataCommand({
        reportId: report.id,
      }).execute(),
    ).rejects.toThrow();
  });
});
