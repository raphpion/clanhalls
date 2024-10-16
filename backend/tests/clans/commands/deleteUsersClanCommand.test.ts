import 'reflect-metadata';
import { DataSource } from 'typeorm';
import container from '../../../src/container';
import User from '../../../src/users/user';
import ClanUser from '../../../src/clans/clanUser';
import Clan from '../../../src/clans/clan';
import DeleteUsersClanCommand from '../../../src/clans/commands/deleteUsersClanCommand';

describe('DeleteUsersClanCommand', () => {
  const db = container.resolve<DataSource>('DataSource');

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

    const user3 = new User();
    user3.email = 'jack.smith@gmail.com';
    user3.emailNormalized = 'jack.smith@gmailcom';
    user3.googleId = '789012';
    user3.username = 'JackSmith';
    user3.usernameNormalized = 'jacksmith';

    const clan = new Clan();
    clan.name = 'The Worst Clan';
    clan.nameNormalized = 'the-worst-clan';

    await db.getRepository(Clan).save(clan);
    await db.getRepository(User).save([user1, user2, user3]);

    const clanUser1 = new ClanUser();
    clanUser1.user = Promise.resolve(user1);
    clanUser1.clan = Promise.resolve(clan);
    clanUser1.isAdmin = true;

    const clanUser2 = new ClanUser();
    clanUser2.user = Promise.resolve(user2);
    clanUser2.clan = Promise.resolve(clan);

    await db.getRepository(ClanUser).save([clanUser1, clanUser2]);
  });

  afterEach(async () => {
    await db.destroy();
  });

  it('deletes the clan and removes all users from it', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'john.doe@gmail.com' });

    const clan = await db
      .getRepository(Clan)
      .findOneByOrFail({ name: 'The Worst Clan' });

    await new DeleteUsersClanCommand({ user }).execute();

    const deletedClan = await db.getRepository(Clan).findOneBy({ id: clan.id });
    expect(deletedClan).toBeNull();

    const clanUsers = await db
      .getRepository(ClanUser)
      .findBy({ clanId: clan.id });
    expect(clanUsers).toHaveLength(0);
  });

  it('throws an error if the user does not have a clan', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'jack.smith@gmail.com' });

    await expect(
      new DeleteUsersClanCommand({ user }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the user is not an admin in the clan', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'jane.doe@gmail.com' });

    await expect(
      new DeleteUsersClanCommand({ user }).execute(),
    ).rejects.toThrow();
  });
});
