import Joi from 'joi';

import Seeder from './seeder';
import Clan from '../../clans/clan';
import ClanRank from '../../clans/clanRank';
import { CLAN_TITLES, type Title } from '../../clans/titles';

type ClanRankSeed = {
  clan: string;
  rank: number;
  title: Title;
};

const clanRankSeedSchema = Joi.object<Record<string, ClanRankSeed>>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    rank: Joi.number().min(-1).max(127).required(),
    title: Joi.string()
      .required()
      .valid(...Object.values(CLAN_TITLES)),
  }),
);

class ClanRankSeeder extends Seeder<ClanRank, ClanRankSeed> {
  entityName = ClanRank.name;
  schema = clanRankSeedSchema;

  protected deserialize(seed: ClanRankSeed): ClanRank {
    const clan = this.seedingService.getEntity(Clan, seed.clan);
    if (!clan) {
      console.log(`Clan not found: ${seed.clan}. Skipping...`);
      return;
    }

    const clanRank = new ClanRank();
    clanRank.rank = seed.rank;
    clanRank.title = seed.title;
    clanRank.clan = Promise.resolve(clan);

    return clanRank;
  }

  protected async getIdentifier(entity: ClanRank): Promise<string> {
    const clan = await entity.clan;
    return `${clan.id}-${entity.rank}`;
  }
}

export default ClanRankSeeder;
