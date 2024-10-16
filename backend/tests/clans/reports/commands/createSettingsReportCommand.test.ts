import 'reflect-metadata';
import { DataSource } from 'typeorm';
import container from '../../../../src/container';
import User from '../../../../src/users/user';
import CreateSettingsReport from '../../../../src/clans/reports/commands/createSettingsReportCommand';
import ClanUser from '../../../../src/clans/clanUser';
import Clan from '../../../../src/clans/clan';
import { Settings } from '../../../../src/clans/reports/settingsReport';

describe('CreateSettingsReport', () => {
  const db = container.resolve<DataSource>('DataSource');

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
      JMOD: 'Jagex Moderator',
      CLAN_RANK_12: 'Lieutenant',
      CLAN_RANK_1: 'Diamond',
      CLAN_RANK_4: 'Zenyte',
      CLAN_RANK_6: 'Gnome Child',
      ADMINISTRATOR: 'Administrator',
      CLAN_RANK_10: 'Legend',
    },
  } as const;

  beforeEach(async () => {
    await db.initialize();

    const user1 = new User();
    user1.email = 'john.doe@gmail.com';
    user1.emailNormalized = 'john.doe@gmailcom';
    user1.googleId = '123456';
    user1.username = 'JohnDoe';
    user1.usernameNormalized = 'johndoe';

    const user2 = new User();
    user2.email = 'jane.doe@gmail.com';
    user2.emailNormalized = 'jane.doe@gmailcom';
    user2.googleId = '654321';
    user2.username = 'JaneDoe';
    user2.usernameNormalized = 'janedoe';

    const clan = new Clan();
    clan.name = 'The Worst Clan';
    clan.nameNormalized = 'the-worst-clan';

    await db.getRepository(Clan).save(clan);
    await db.getRepository(User).save([user1, user2]);

    const clanUser = new ClanUser();
    clanUser.user = Promise.resolve(user1);
    clanUser.clan = Promise.resolve(clan);

    await db.getRepository(ClanUser).save(clanUser);
  });

  afterEach(async () => {
    await db.destroy();
  });

  it('creates a settings report', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'john.doe@gmail.com' });

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'The Worst Clan',
    });

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
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'jane.doe@gmail.com' });

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'The Worst Clan',
    });

    await expect(
      new CreateSettingsReport({
        user,
        clan,
        settings: data,
      }).execute(),
    ).rejects.toThrow();
  });
});
