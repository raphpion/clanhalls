import { inject, injectable } from 'tsyringe';

import type { CredentialsRelations } from './credentials';
import Credentials from './credentials';
import type { ICredentialsRepository } from './credentialsRepository';
import type User from '../users/user';

export interface ICredentialsService {
  createCredentialsForUser(
    user: User,
    name: string,
    scope: string
  ): Promise<[Credentials, string]>;

  getCredentialsByClientId(
    clientId: string,
    relations: CredentialsRelations[]
  ): Promise<Credentials | null>;
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

  public async getCredentialsByClientId(
    clientId: string,
    relations: CredentialsRelations[] = []
  ): Promise<Credentials | null> {
    return this.credentialsRepository.getCredentialsByClientId(
      clientId,
      relations
    );
  }
}

export default CredentialsService;
