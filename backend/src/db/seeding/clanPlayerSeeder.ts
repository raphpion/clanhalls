import Joi from 'joi';

import Seeder from './seeder';
import Clan from '../../clans/clan';
import ClanPlayer from '../../clans/clanPlayer';
import Player from '../../players/player';

type ClanPlayerSeed = {
  clan: string;
  player: string;
  rank: number;
  last_seen_at: string;
};

const clanPlayerSeedSchema = Joi.object<
  Record<string, ClanPlayerSeed>
>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    player: Joi.string().required(),
    rank: Joi.number().min(-1).max(127).required(),
    last_seen_at: Joi.string().required(),
  }),
);

class ClanPlayerSeeder extends Seeder<ClanPlayer, ClanPlayerSeed> {
  entityName = ClanPlayer.name;
  schema = clanPlayerSeedSchema;

  protected deserialize(seed: ClanPlayerSeed): ClanPlayer {
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
