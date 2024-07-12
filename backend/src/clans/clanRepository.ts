import { injectable } from 'tsyringe';

import Clan from './clan';
import db from '../db';

export interface IClanRepository {
  getClanByName(name: string): Promise<Clan | null>;
  getClanByUuid(uuid: string): Promise<Clan | null>;
  saveClan(clan: Clan): Promise<Clan>;
}

@injectable()
class ClanRepository implements IClanRepository {
  private readonly clanRepository = db.getRepository(Clan);

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
}

export default ClanRepository;
