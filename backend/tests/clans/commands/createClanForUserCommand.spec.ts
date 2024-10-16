import 'reflect-metadata';
import { DataSource } from 'typeorm';
import container from '../../../src/container';
import User from '../../../src/users/user';
import CreateClanForUserCommand from '../../../src/clans/commands/createClanForUserCommand';
import ClanUser from '../../../src/clans/clanUser';
import Clan from '../../../src/clans/clan';

describe('CreateClanForUserCommand', () => {
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

    const clan = new Clan();
    clan.name = 'The Worst Clan';
    clan.nameNormalized = 'the-worst-clan';

    await db.getRepository(Clan).save(clan);
    await db.getRepository(User).save([user1, user2]);

    const clanUser = new ClanUser();
    clanUser.user = Promise.resolve(user2);
    clanUser.clan = Promise.resolve(clan);

    await db.getRepository(ClanUser).save(clanUser);
  });

  afterEach(async () => {
    await db.destroy();
  });

  it('creates a clan and adds the user to it as an admin', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'john.doe@gmail.com' });

    await new CreateClanForUserCommand({
      name: 'The Best Clan!*',
      user,
    }).execute();

    const clan = await db.getRepository(Clan).findOneByOrFail({
      name: 'The Best Clan!*',
    });
    expect(clan).not.toBeNull();

    const clanUser = await db
      .getRepository(ClanUser)
      .findOneByOrFail({ clanId: clan.id });
    expect(clanUser).not.toBeNull();
    expect(clanUser.isAdmin).toBe(true);
  });

  it('throws an error if the name or normalized name is already in use', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'john.doe@gmail.com' });

    await expect(
      new CreateClanForUserCommand({
        name: 'The Worst Clan',
        user,
      }).execute(),
    ).rejects.toThrow();

    await expect(
      new CreateClanForUserCommand({
        name: 'The Worst Clan!*',
        user,
      }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the user is already in a clan', async () => {
    const user = await db
      .getRepository(User)
      .findOneByOrFail({ email: 'jane.doe@gmail.com' });

    await expect(
      new CreateClanForUserCommand({
        name: 'The Best Clan',
        user,
      }).execute(),
    ).rejects.toThrow();
  });
});
