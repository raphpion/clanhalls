import Joi from 'joi';

import { Seeder } from './seeder';
import Clan from '../../clans/clan';
import ClanUser from '../../clans/clanUser';
import User from '../../users/user';

type ClanUserSeeding = {
  clan: string;
  user: string;
  admin: boolean;
};

const clanUserSeedingSchema = Joi.object<
  Record<string, ClanUserSeeding>
>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    user: Joi.string().required(),
    admin: Joi.boolean().required(),
  }),
);

class ClanUserSeeder extends Seeder<ClanUser, ClanUserSeeding> {
  entityName = ClanUser.name;
  schema = clanUserSeedingSchema;

  protected deserialize(seed: ClanUserSeeding): ClanUser {
    const clan = this.seedingService.getEntity(Clan, seed.clan);
    if (!clan) {
      console.log(`Clan not found: ${seed.clan}. Skipping...`);
      return;
    }

    const user = this.seedingService.getEntity(User, seed.user);
    if (!user) {
      console.log(`User not found: ${seed.user}. Skipping...`);
      return;
    }

    const clanUser = new ClanUser();
    clanUser.clan = Promise.resolve(clan);
    clanUser.user = Promise.resolve(user);
    clanUser.isAdmin = seed.admin;

    return clanUser;
  }

  protected async getIdentifier(entity: ClanUser): Promise<string> {
    const [clan, user] = await Promise.all([entity.clan, entity.user]);
    return `${clan.id}-${user.id}`;
  }
}

export default ClanUserSeeder;
