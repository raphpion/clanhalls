import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { injectable } from 'tsyringe';

export interface IGoogleService {
  verifyIdToken(idToken: string): Promise<TokenPayload>;
}

@injectable()
class GoogleService implements IGoogleService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(idToken: string): Promise<TokenPayload> {
    const token = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return token.getPayload();
  }
}

export default GoogleService;
