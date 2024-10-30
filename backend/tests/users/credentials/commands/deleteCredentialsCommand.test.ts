import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../../src/container';
import type SeedingService from '../../../../src/db/seeding/seedingService';
import DeleteCredentialsCommand from '../../../../src/users/credentials/commands/deleteCredentialsCommand';
import Credentials from '../../../../src/users/credentials/credentials';

describe('DeleteCredentialsCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('should delete credentials', async () => {
    const credentials = seedingService.getEntity(
      Credentials,
      'john_doe_onboarding',
    )!;

    await new DeleteCredentialsCommand({
      clientId: credentials.clientId,
    }).execute();

    await expect(
      db.getRepository(Credentials).findOneBy({ id: credentials.id }),
    ).resolves.toBeNull();
  });

  it('throws an error if the credentials do not exist', async () => {
    await expect(
      new DeleteCredentialsCommand({
        clientId: 'non_existent',
      }).execute(),
    ).rejects.toThrow();
  });
});
