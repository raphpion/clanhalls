import 'reflect-metadata';
import { DataSource } from 'typeorm';
import container from '../../../../src/container';
import User from '../../../../src/users/user';
import CreateMembersListReportCommand from '../../../../src/clans/reports/commands/createMembersListReportCommand';
import ClanUser from '../../../../src/clans/clanUser';
import Clan from '../../../../src/clans/clan';
import CLAN_RANKS from '../../../../src/clans/ranks';
import { ListMember } from '../../../../src/clans/reports/membersListReport';

describe('CreateMembersListReportCommand', () => {
  const db = container.resolve<DataSource>('DataSource');

  const data: ListMember[] = [
    {
      name: 'JohnDoe',
      rank: CLAN_RANKS[17],
    },
    {
      name: 'JaneDoe',
      rank: CLAN_RANKS[16],
    },
    {
      name: 'JackSmith',
      rank: CLAN_RANKS[1],
    },
  ] as const;

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

  it('creates a members list report', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'john.doe@gmail.com' });

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'The Worst Clan',
    });

    const report = await new CreateMembersListReportCommand({
      user,
      clan,
      members: data,
    }).execute();

    expect(report).not.toBeNull();
  });

  it('throws an error if the user is not a member of the clan', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'jane.doe@gmail.com' });

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'The Worst Clan',
    });

    await expect(
      new CreateMembersListReportCommand({
        user,
        clan,
        members: data,
      }).execute(),
    ).rejects.toThrow();
  });
});
