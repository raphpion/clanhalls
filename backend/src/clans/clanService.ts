import { inject, injectable } from 'tsyringe';

import Clan from './clan';
import type { IClanRepository } from './clanRepository';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type User from '../users/user';

export interface IClanService {
  createClanForUser(name: string, user: User): Promise<Clan>;
}

@injectable()
class ClanService implements IClanService {
  constructor(
    @inject('ClanRepository') private readonly clanRepository: IClanRepository
  ) {}

  async createClanForUser(name: string, user: User) {
    const existingClan = await this.clanRepository.getClanByName(name);
    if (existingClan) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        'A clan with this name already exists'
      );
    }

    const clan = new Clan();
    clan.name = name;
    clan.nameNormalized = Clan.normalizeName(name);
    await this.clanRepository.saveClan(clan);

    await clan.addUser(user, true);

    return this.clanRepository.saveClan(clan);
  }
}

export default ClanService;
