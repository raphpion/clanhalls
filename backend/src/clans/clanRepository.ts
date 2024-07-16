import { injectable } from 'tsyringe';

import Clan from './clan';
import type { ClanPlayerQueryParams } from './clanPlayer';
import ClanPlayer from './clanPlayer';
import CLAN_RANKS from './ranks';
import MemberActivityReport from './reports/memberActivityReport';
import SettingsReport from './reports/settingsReport';
import db from '../db';
import type { PaginatedQueryResult } from '../db/queries';
import { resolvePaginatedQuery } from '../db/queries';

export interface IClanRepository {
  getClanByName(name: string): Promise<Clan | null>;
  getClanByUuid(uuid: string): Promise<Clan | null>;
  queryClanPlayers(
    clan: Clan,
    params: ClanPlayerQueryParams
  ): Promise<PaginatedQueryResult<ClanPlayer>>;
  saveClan(clan: Clan): Promise<Clan>;
  saveMemberActivityReport(
    memberActivityReport: MemberActivityReport
  ): Promise<MemberActivityReport>;
  saveSettingsReport(settingsReport: SettingsReport): Promise<SettingsReport>;
}

@injectable()
class ClanRepository implements IClanRepository {
  private readonly clanRepository = db.getRepository(Clan);
  private readonly clanPlayerRepository = db.getRepository(ClanPlayer);
  private readonly memberActivityReportRepository =
    db.getRepository(MemberActivityReport);
  private readonly settingsReportRepository = db.getRepository(SettingsReport);

  public async getClanByName(name: string) {
    const nameNormalized = Clan.normalizeName(name);

    return this.clanRepository.findOneBy({ nameNormalized });
  }

  public async getClanByUuid(uuid: string) {
    return this.clanRepository.findOneBy({ uuid });
  }

  public async queryClanPlayers(clan: Clan, params: ClanPlayerQueryParams) {
    const sort = (() => {
      if (params.orderBy.field === 'rank') {
        return `CASE clanPlayer.rank ${CLAN_RANKS.map(
          (rank, index) => `WHEN '${rank}' THEN ${index}`
        ).join(' ')} ELSE ${CLAN_RANKS.length} END`;
      }

      if (params.orderBy.field === 'username') {
        return 'player.username';
      }

      return `clanPlayer.${params.orderBy.field}`;
    })();

    const query = this.clanPlayerRepository
      .createQueryBuilder('clanPlayer')
      .leftJoinAndSelect('clanPlayer.player', 'player')
      .where('clanPlayer.clanId = :clanId', { clanId: clan.id })
      .andWhere('player.username ILIKE :search', {
        search: `%${params.search}%`,
      });

    if (params.orderBy.field === 'rank') {
      query
        .addSelect(sort, 'rank_order')
        .orderBy('rank_order', params.orderBy.order);
    } else {
      query.orderBy(sort, params.orderBy.order);
    }

    return resolvePaginatedQuery(query, params);
  }

  public async saveClan(clan: Clan) {
    return this.clanRepository.save(clan);
  }

  public async saveMemberActivityReport(
    memberActivityReport: MemberActivityReport
  ) {
    return this.memberActivityReportRepository.save(memberActivityReport);
  }

  public async saveSettingsReport(settingsReport: SettingsReport) {
    return this.settingsReportRepository.save(settingsReport);
  }
}

export default ClanRepository;
