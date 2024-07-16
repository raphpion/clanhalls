import { injectable } from 'tsyringe';

import Credentials from './credentials';
import db from '../db';

export interface ICredentialsRepository {
  deleteCredentials(credentials: Credentials): Promise<void>;

  getCredentialsByClientId(
    clientId: string,
    relations?: string[]
  ): Promise<Credentials | null>;

  saveCredentials(credentials: Credentials): Promise<Credentials>;
}

@injectable()
class CredentialsRepository implements ICredentialsRepository {
  private readonly credentialsRepository = db.getRepository(Credentials);

  public async deleteCredentials(credentials: Credentials) {
    await this.credentialsRepository.remove(credentials);
  }

  public async getCredentialsByClientId(
    clientId: string,
    relations: string[] = []
  ) {
    return this.credentialsRepository.findOne({
      where: { clientId },
      relations,
    });
  }

  public async saveCredentials(credentials: Credentials) {
    return this.credentialsRepository.save(credentials);
  }
}

export default CredentialsRepository;
