import Joi from 'joi';

import Seeder from './seeder';
import Credentials from '../../users/credentials/credentials';
import User from '../../users/user';

type CredentialsSeed = {
  user: string;
  name: string;
  scope: string;
};

const credentialsSeedSchema = Joi.object<
  Record<string, CredentialsSeed>
>().pattern(
  Joi.string(),
  Joi.object({
    user: Joi.string().required(),
    name: Joi.string().required(),
    scope: Joi.string().required(),
  }),
);

class CredentialsSeeder extends Seeder<Credentials, CredentialsSeed> {
  entityName = Credentials.name;
  schema = credentialsSeedSchema;

  protected async deserialize(seed: CredentialsSeed): Promise<Credentials> {
    const user = this.seedingService.getEntity(User, seed.user);
    if (!user) {
      console.log(`User not found: ${seed.user}. Skipping...`);
      return;
    }

    const credentials = new Credentials();
    credentials.name = seed.name;
    credentials.scope = seed.scope;
    credentials.generateClientId();
    await credentials.generateClientSecret();
    credentials.user = Promise.resolve(user);

    return credentials;
  }

  protected getIdentifier(entity: Credentials): string {
    return entity.clientId;
  }
}

export default CredentialsSeeder;
