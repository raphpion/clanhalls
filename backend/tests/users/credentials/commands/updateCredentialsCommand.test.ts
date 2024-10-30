import 'reflect-metadata';

// eslint-disable-next-line import/order
import container from '../../../../src/container';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import UpdateCredentialsCommand from '../../../../src/users/credentials/commands/updateCredentialsCommand';
import Credentials from '../../../../src/users/credentials/credentials';

describe('UpdateCredentialsCommand', () => {
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('should update credentials', async () => {
    const credentials = seedingService.getEntity(
      Credentials,
      'john_doe_onboarding',
    )!;

    const updatedCredentials = await new UpdateCredentialsCommand({
      clientId: credentials.clientId,
      updates: {
        name: 'Test',
        scope: '',
      },
    }).execute();

    expect(updatedCredentials).toBeDefined();
    expect(updatedCredentials.name).toBe('Test');
    expect(updatedCredentials.scope).toBe('');
  });

  it('throws an error if the credentials do not exist', async () => {
    await expect(
      new UpdateCredentialsCommand({
        clientId: 'non_existent',
        updates: {
          name: 'Test',
          scope: '',
        },
      }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the scope is invalid', async () => {
    const credentials = seedingService.getEntity(
      Credentials,
      'john_doe_onboarding',
    )!;

    await expect(
      new UpdateCredentialsCommand({
        clientId: credentials.clientId,
        updates: {
          name: 'Test',
          scope: 'invalid',
        },
      }).execute(),
    ).rejects.toThrow();
  });
});
