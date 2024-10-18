import Joi from 'joi';

import { Seeder } from './seeder';
import Clan from '../../clans/clan';
import ClanRank from '../../clans/clanRank';
import { CLAN_RANKS, type Rank } from '../../clans/ranks';
import { CLAN_TITLES, type Title } from '../../clans/titles';

type ClanRankSeeding = {
  clan: string;
  rank: Rank;
  title: Title;
};

const clanRankSeedingSchema = Joi.object<
  Record<string, ClanRankSeeding>
>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    rank: Joi.string()
      .required()
      .valid(...Object.values(CLAN_RANKS)),
    title: Joi.string()
      .required()
      .valid(...Object.values(CLAN_TITLES)),
  }),
);

class ClanRankSeeder extends Seeder<ClanRank, ClanRankSeeding> {
  entityName = ClanRank.name;
  schema = clanRankSeedingSchema;

  protected deserialize(seed: ClanRankSeeding): ClanRank {
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
