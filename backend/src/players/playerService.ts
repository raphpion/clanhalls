import { WOMClient } from '@wise-old-man/utils';
import { inject, injectable } from 'tsyringe';

import type { IPlayerRepository } from './playerRepository';
import { withSafeWiseOldMan } from '../helpers/wiseOldMan';

export interface IPlayerService {
  associatePlayerToWiseOldMan(playerId: number): Promise<void>;
}

@injectable()
class PlayerService implements IPlayerService {
  constructor(
    @inject('PlayerRepository') private playerRepository: IPlayerRepository
  ) {}
  async associatePlayerToWiseOldMan(playerId: number): Promise<void> {
    const player = await this.playerRepository.getPlayerById(playerId);
    if (!player || player.wiseOldManId) {
      return;
    }

    const wiseOldMan = new WOMClient();
    const wiseOldManPlayer = await withSafeWiseOldMan(() =>
      wiseOldMan.players.getPlayerDetails(player.username)
    );

    if (!wiseOldManPlayer) {
      return;
    }

    player.wiseOldManId = wiseOldManPlayer.id;
    await this.playerRepository.savePlayer(player);
  }
}

export default PlayerService;
