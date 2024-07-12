import { inject, injectable } from 'tsyringe';

import Credentials from './credentials';
import type { ICredentialsRepository } from './credentialsRepository';
import type User from '../users/user';

export interface ICredentialsService {
  createCredentialsForUser(
    user: User,
    name: string,
    scope: string
  ): Promise<[Credentials, string]>;
}

@injectable()
class CredentialsService implements ICredentialsService {
  constructor(
    @inject('CredentialsRepository')
    private readonly credentialsRepository: ICredentialsRepository
  ) {}

  public async createCredentialsForUser(
    user: User,
    name: string,
    scope: string
  ): Promise<[Credentials, string]> {
    const credentials = new Credentials();
    credentials.name = name;
    credentials.scope = scope;
    credentials.user = Promise.resolve(user);
    credentials.generateClientId();

    const clientSecret = await credentials.generateClientSecret();
    const savedCredentials = await this.credentialsRepository.saveCredentials(
      credentials
    );

    return [savedCredentials, clientSecret];
  }
}

export default CredentialsService;
