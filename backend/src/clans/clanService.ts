import { inject, injectable } from 'tsyringe';

import Clan from './clan';
import type { IClanRepository } from './clanRepository';
import MemberActivityReport from './memberActivityReport';
import type { MemberActivity } from './memberActivityReport';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type User from '../users/user';

export interface IClanService {
  createClanForUser(user: User, name: string): Promise<Clan>;
  createMemberActivityReport(
    user: User,
    clan: Clan,
    members: MemberActivity[]
  ): Promise<MemberActivityReport>;
}

@injectable()
class ClanService implements IClanService {
  constructor(
    @inject('ClanRepository') private readonly clanRepository: IClanRepository
  ) {}

  async createClanForUser(user: User, name: string) {
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

  async createMemberActivityReport(
    user: User,
    clan: Clan,
    members: MemberActivity[]
  ) {
    const memberActivityReport = new MemberActivityReport();

    memberActivityReport.data = members;
    memberActivityReport.clan = Promise.resolve(clan);
    memberActivityReport.user = Promise.resolve(user);

    return this.clanRepository.saveMemberActivityReport(memberActivityReport);
  }
}

export default ClanService;
