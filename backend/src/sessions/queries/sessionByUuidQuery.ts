import db from '../../db';
import Query from '../../query';
import Session from '../session';

type Params = {
  uuid: string;
  relations?: string[];
};

type Result = Session | null;

class SessionByUuidQuery extends Query<Params, Result> {
  async execute() {
    const repository = db.getRepository(Session);
    const { uuid, relations } = this.params;

    const session = await repository.findOne({
      where: { uuid },
      relations,
    });

    return session;
  }
}

export default SessionByUuidQuery;
