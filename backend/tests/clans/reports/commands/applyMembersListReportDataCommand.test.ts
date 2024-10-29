import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../../src/container';
import ApplyMembersListReportDataCommand from '../../../../src/clans/reports/commands/applyMembersListReportDataCommand';
import MembersListReport from '../../../../src/clans/reports/membersListReport';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import Player from '../../../../src/players/player';

describe('ApplyMembersListReportDataCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('updates existing clan players rank', async () => {
    const report = seedingService.getEntity(
      MembersListReport,
      'iron_wolves__john_doe__02',
    )!;

    await new ApplyMembersListReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db.getRepository(MembersListReport).findOne({
      where: { id: report.id },
      relations: ['clan', 'clan.clanPlayers'],
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

      expect(clanPlayer.rank).toBe(reportMember.rank);
    }
  });

  it('removes clan players for members not present in the clan', async () => {
    const report = seedingService.getEntity(
      MembersListReport,
      'iron_wolves__john_doe__02',
    )!;

    const clan = await report.clan;
    const clanPlayers = await clan.clanPlayers;
    const players = await Promise.all(clanPlayers.map((cp) => cp.player));
    const expectedNewLength = players.filter((p) =>
      report.data.some((m) => m.name === p.username),
    ).length;

    await new ApplyMembersListReportDataCommand({
      reportId: report.id,
    }).execute();

    const appliedReport = await db.getRepository(MembersListReport).findOne({
      where: { id: report.id },
      relations: ['clan', 'clan.clanPlayers'],
    });

    const newClan = await appliedReport!.clan;
    const newClanPlayers = await newClan.clanPlayers;

    expect(appliedReport).not.toBeNull();
    expect(appliedReport!.appliedAt).not.toBeNull();
    expect(newClanPlayers.length).toBe(expectedNewLength);
  });

  it('updates existing players, adds wise old man id if not present, in case they have changed their name', async () => {
    const report = seedingService.getEntity(
      MembersListReport,
      'iron_wolves__john_doe__03',
    )!;

    const johnDoe = seedingService.getEntity(Player, 'john_doe')!;
    const janeSmith = seedingService.getEntity(Player, 'jane_smith')!;

    await new ApplyMembersListReportDataCommand({
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
      MembersListReport,
      'iron_wolves__john_doe__01',
    )!;

    await expect(
      new ApplyMembersListReportDataCommand({
        reportId: report.id,
      }).execute(),
    ).rejects.toThrow();
  });
});
