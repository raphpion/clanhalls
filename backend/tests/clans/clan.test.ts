import User from '../../src/users/user';
import Clan from '../../src/clans/clan';

describe('Clan', () => {
  it('normalizes names adequately', () => {
    expect(Clan.normalizeName('The Best Clan!*')).toBe('the-best-clan');
  });

  it('throws an error when adding a user who is already in the clan', async () => {
    const clan = new Clan();
    const user = new User();

    clan.clanUsers = Promise.resolve([]);
    clan.addUser(user);

    await expect(clan.addUser(user)).rejects.toThrow();
  });
});
