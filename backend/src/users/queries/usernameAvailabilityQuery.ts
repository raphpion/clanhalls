import Query from '../../query';
import User from '../user';

type Params = {
  username: string;
};

type Result = boolean;

class UsernameAvailabilityQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);
    const { username } = this.params;

    const usernameNormalized = User.normalizeUsername(username);
    const existingUser = await repository.findOne({
      where: { usernameNormalized },
    });

    return existingUser === null;
  }
}

export default UsernameAvailabilityQuery;
