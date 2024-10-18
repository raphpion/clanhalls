import Joi from 'joi';

import Seeder from './seeder';
import User from '../../users/user';

type UserSeed = {
  google_id: string;
  username: string;
  email: string;
};

const userSeedSchema = Joi.object<Record<string, UserSeed>>().pattern(
  Joi.string(),
  Joi.object({
    google_id: Joi.number()
      .integer()
      .strict()
      .custom((v) => v.toString())
      .required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
);

class UserSeeder extends Seeder<User, UserSeed> {
  entityName = User.name;
  schema = userSeedSchema;

  protected deserialize(seed: UserSeed): User {
    const user = new User();
    user.googleId = seed.google_id;
    user.username = seed.username;
    user.usernameNormalized = User.normalizeUsername(seed.username);
    user.email = seed.email;
    user.emailNormalized = User.normalizeEmail(seed.email);

    return user;
  }

  protected getIdentifier(entity: User): string {
    return entity.username;
  }
}

export default UserSeeder;
