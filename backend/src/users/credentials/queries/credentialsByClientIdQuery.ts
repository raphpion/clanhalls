import db from '../../../db';
import Query from '../../../query';
import Credentials from '../credentials';

type Params = {
  clientId: string;
  relations?: string[];
};

type Result = Credentials | null;

class CredentialsByClientIdQuery extends Query<Params, Result> {
  async execute() {
    const repository = db.getRepository(Credentials);

    const { clientId, relations } = this.params;
    return repository.findOne({
      where: { clientId },
      relations,
    });
  }
}

export default CredentialsByClientIdQuery;
