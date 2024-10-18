import Joi from 'joi';

import { Seeder } from './seeder';
import Player from '../../players/player';

type PlayerSeeding = {
  wise_old_man_id: number | null;
  username: string;
};

const playerSeedingSchema = Joi.object<Record<string, PlayerSeeding>>().pattern(
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

class PlayerSeeder extends Seeder<Player, PlayerSeeding> {
  entityName = Player.name;
  schema = playerSeedingSchema;

  protected deserialize(seed: PlayerSeeding): Player {
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
