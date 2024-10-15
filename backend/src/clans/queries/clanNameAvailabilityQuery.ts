
import Query from '../../query';
import Clan from '../clan';

type Params = {
  name: string;
};

type Result = boolean;

class ClanNameAvailabilityQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(Clan);

    const { name } = this.params;

    const nameNormalized = Clan.normalizeName(name);
    const existingClan = await repository.findOne({
      where: { nameNormalized },
    });

    return existingClan === null;
  }
}

export default ClanNameAvailabilityQuery;
