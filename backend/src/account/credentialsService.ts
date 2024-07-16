import { inject, injectable } from 'tsyringe';

import Credentials from './credentials';
import type { ICredentialsRepository } from './credentialsRepository';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type User from '../users/user';

export interface ICredentialsService {
  createCredentialsForUser(
    user: User,
    name: string,
    scope: string
  ): Promise<[Credentials, string]>;

  deleteCredentialsForUser(user: User, clientId: string): Promise<void>;

  getCredentialsByClientId(
    clientId: string,
    relations: string[]
  ): Promise<Credentials | null>;

  updateLastUsedAt(credentials: Credentials): Promise<Credentials>;
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

  public async deleteCredentialsForUser(user: User, clientId: string) {
    const credentials =
      await this.credentialsRepository.getCredentialsByClientId(clientId);

    if (!credentials || (await credentials.user).id !== user.id) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    await this.credentialsRepository.deleteCredentials(credentials);
  }

  public async getCredentialsByClientId(
    clientId: string,
    relations: string[] = []
  ): Promise<Credentials | null> {
    return this.credentialsRepository.getCredentialsByClientId(
      clientId,
      relations
    );
  }

  public async updateLastUsedAt(
    credentials: Credentials
  ): Promise<Credentials> {
    credentials.lastUsedAt = new Date();

    return this.credentialsRepository.saveCredentials(credentials);
  }
}

export default CredentialsService;
