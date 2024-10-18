import Joi from 'joi';

import Seeder from './seeder';
import Clan from '../../clans/clan';

type ClanSeed = {
  name: string;
  name_in_game: string;
  last_synced_at: string | null;
};

const clanSeedSchema = Joi.object<Record<string, ClanSeed>>().pattern(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
    name_in_game: Joi.string().optional(),
    last_synced_at: Joi.string().allow(null).optional().default(null),
  }),
);

class ClanSeeder extends Seeder<Clan, ClanSeed> {
  entityName = Clan.name;
  schema = clanSeedSchema;

  protected deserialize(seed: ClanSeed): Clan {
    const clan = new Clan();
    clan.name = seed.name;
    clan.nameNormalized = Clan.normalizeName(seed.name);
    clan.nameInGame = seed.name_in_game;
    clan.lastSyncedAt = seed.last_synced_at
      ? new Date(seed.last_synced_at)
      : null;

    return clan;
  }

  protected getIdentifier(clan: Clan) {
    return clan.name;
  }
}

export default ClanSeeder;
