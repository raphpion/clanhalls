import Joi from 'joi';

import Seeder from './seeder';
import Player from '../../players/player';

type PlayerSeed = {
  wise_old_man_id: number | null;
  username: string;
};

const playerSeedSchema = Joi.object<Record<string, PlayerSeed>>().pattern(
  Joi.string(),
  Joi.object({
    wise_old_man_id: Joi.number()
      .integer()
      .strict()
      .allow(null)
      .optional()
      .default(null),
    username: Joi.string().required(),
  }),
);

class PlayerSeeder extends Seeder<Player, PlayerSeed> {
  entityName = Player.name;
  schema = playerSeedSchema;

  protected deserialize(seed: PlayerSeed): Player {
    const player = new Player();
    player.wiseOldManId = seed.wise_old_man_id;
    player.username = seed.username;

    return player;
  }

  protected getIdentifier(entity: Player): string {
    return entity.username;
  }
}

export default PlayerSeeder;
