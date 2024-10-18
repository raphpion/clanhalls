import Joi from 'joi';

import { Seeder } from './seeder';
import Clan from '../../clans/clan';
import ClanPlayer from '../../clans/clanPlayer';
import type { Rank } from '../../clans/ranks';
import CLAN_RANKS from '../../clans/ranks';
import Player from '../../players/player';

type ClanPlayerSeeding = {
  clan: string;
  player: string;
  rank: Rank;
  last_seen_at: string;
};

const clanPlayerSeedingSchema = Joi.object<
  Record<string, ClanPlayerSeeding>
>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    player: Joi.string().required(),
    rank: Joi.string()
      .required()
      .valid(...Object.values(CLAN_RANKS)),
    last_seen_at: Joi.string().required(),
  }),
);

class ClanPlayerSeeder extends Seeder<ClanPlayer, ClanPlayerSeeding> {
  entityName = ClanPlayer.name;
  schema = clanPlayerSeedingSchema;

  protected deserialize(seed: ClanPlayerSeeding): ClanPlayer {
    const clan = this.seedingService.getEntity(Clan, seed.clan);
    if (!clan) {
      console.log(`Clan not found: ${seed.clan}. Skipping...`);
      return;
    }

    const player = this.seedingService.getEntity(Player, seed.player);
    if (!player) {
      console.log(`Player not found: ${seed.player}. Skipping...`);
      return;
    }

    const clanPlayer = new ClanPlayer();
    clanPlayer.clan = Promise.resolve(clan);
    clanPlayer.player = Promise.resolve(player);
    clanPlayer.rank = seed.rank;
    clanPlayer.lastSeenAt = new Date(seed.last_seen_at);

    return clanPlayer;
  }

  protected async getIdentifier(entity: ClanPlayer): Promise<string> {
    const clan = await entity.clan;
    const player = await entity.player;
    return `${clan.id}-${player.id}`;
  }
}

export default ClanPlayerSeeder;
