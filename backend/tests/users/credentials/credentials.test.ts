import Credentials, {
  Scopes,
} from '../../../src/users/credentials/credentials';

describe('Credentials', () => {
  it('generates a client ID of 32 characters', () => {
    const credentials = new Credentials();
    credentials.generateClientId();
    expect(credentials.clientId).toHaveLength(32);
  });

  it('generates a client secret and hashes it', async () => {
    const credentials = new Credentials();
    const secret = await credentials.generateClientSecret();
    expect(credentials.clientSecretHash).not.toBe(secret);
  });

  it('validates a valid client secret', async () => {
    const credentials = new Credentials();
    const secret = await credentials.generateClientSecret();
    expect(await credentials.validateClientSecret(secret)).toBe(true);
  });

  it('invalidates an invalid client secret', async () => {
    const credentials = new Credentials();
    await credentials.generateClientSecret();
    expect(await credentials.validateClientSecret('invalid')).toBe(false);
  });

  it('validates scopes string successfully', () => {
    const scopes = 'clan:reporting'; // TODO: add more scopes here
    expect(Credentials.validateScope(scopes)).toBe(true);
  });

  it('validates if credentials have the required scope', () => {
    const credentials = new Credentials();
    credentials.scope = 'clan:reporting';
    const requiredScope = [Scopes.CLAN_REPORTING];
    expect(credentials.validateScope(requiredScope)).toBe(true);
  });

  it('invalidates if credentials do not have the required scope', () => {
    const credentials = new Credentials();
    credentials.scope = '';
    const requiredScope = [Scopes.CLAN_REPORTING];
    expect(credentials.validateScope(requiredScope)).toBe(false);
  });
});
