import 'reflect-metadata';

// eslint-disable-next-line import/order
import container from '../../../../src/container';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import CreateCredentialsCommand from '../../../../src/users/credentials/commands/createCredentialsCommand';
import User from '../../../../src/users/user';

describe('CreateCredentialsCommand', () => {
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('should create credentials and return the client secret', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;

    const [credentials, clientSecret] = await new CreateCredentialsCommand({
      user,
      name: 'Test',
      scope: 'clan:reporting',
    }).execute();

    expect(credentials).toBeDefined();
    expect(credentials.name).toBe('Test');
    expect(credentials.scope).toBe('clan:reporting');

    expect(clientSecret).toBeDefined();
    await expect(credentials.validateClientSecret(clientSecret)).resolves.toBe(
      true,
    );
  });

  it('throws an error if the scope is invalid', async () => {
    const user = seedingService.getEntity(User, 'john_doe')!;

    await expect(
      new CreateCredentialsCommand({
        user,
        name: 'Test',
        scope: 'invalid',
      }).execute(),
    ).rejects.toThrow();
  });
});
