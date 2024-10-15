import Query from '../../query';
import User from '../user';

type Params = {
  googleId: string;
  relations?: string[];
};

type Result = User | null;

class UserByGoogleIdQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);
    const { googleId, relations } = this.params;

    return repository.findOne({
      where: { googleId },
      relations,
    });
  }
}

export default UserByGoogleIdQuery;
