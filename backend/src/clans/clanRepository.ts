import { injectable } from 'tsyringe';

import Clan from './clan';
import MemberActivityReport from './reports/memberActivityReport';
import SettingsReport from './reports/settingsReport';
import db from '../db';

export interface IClanRepository {
  getClanByName(name: string): Promise<Clan | null>;
  getClanByUuid(uuid: string): Promise<Clan | null>;
  saveClan(clan: Clan): Promise<Clan>;
  saveMemberActivityReport(
    memberActivityReport: MemberActivityReport
  ): Promise<MemberActivityReport>;
  saveSettingsReport(settingsReport: SettingsReport): Promise<SettingsReport>;
}

@injectable()
class ClanRepository implements IClanRepository {
  private readonly clanRepository = db.getRepository(Clan);
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
