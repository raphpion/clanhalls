import { injectable } from 'tsyringe';

import Player from './player';
import db from '../db';

export interface IPlayerRepository {
  getPlayerById(id: number, relations?: string[]): Promise<Player | null>;
  savePlayer(player: Player): Promise<Player>;
}

@injectable()
class PlayerRepository implements IPlayerRepository {
  private readonly playerRepository = db.getRepository(Player);

  async getPlayerById(
    id: number,
    relations: string[] = []
  ): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { id }, relations });
  }

  async savePlayer(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }
}

export default PlayerRepository;
