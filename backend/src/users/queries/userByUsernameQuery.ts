import db from '../../db';
import Query from '../../query';
import User from '../user';

type Params = {
  username: string;
  relations?: string[];
};

type Result = User | null;

class UserByUsernameQuery extends Query<Params, Result> {
  async execute() {
    const repository = db.getRepository(User);
    const { relations, username } = this.params;

    const usernameNormalized = User.normalizeUsername(username);

    return repository.findOne({
      where: { usernameNormalized },
      relations,
    });
  }
}

export default UserByUsernameQuery;
