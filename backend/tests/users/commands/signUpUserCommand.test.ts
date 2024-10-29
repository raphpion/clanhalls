import 'reflect-metadata';
import type { DataSource } from 'typeorm';

// eslint-disable-next-line import/order
import container from '../../../src/container';
import type SeedingService from '../../../src/db/seeding/seedingService';
import SignUpUserCommand from '../../../src/users/commands/signUpUserCommand';

describe('SignUpUserCommand', () => {
  const db = container.resolve<DataSource>('DataSource');
  const seedingService = container.resolve<SeedingService>('SeedingService');

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    seedingService.clear();
  });

  it('signs up a new user', async () => {
    await new SignUpUserCommand({
      googleId: 'definitely-not-taken',
      email: 'not.taken@gmail.com',
      emailVerified: true,
      pictureUrl: 'https://example.com/picture.jpg',
    }).execute();

    const user = await db.getRepository('User').findOne({
      where: { email: 'not.taken@gmail.com' },
    });

    expect(user).not.toBeNull();
    expect(user!.googleId).toBe('definitely-not-taken');
    expect(user!.email).toBe('not.taken@gmail.com');
    expect(user!.emailVerified).toBe(true);
    expect(user!.pictureUrl).toBe('https://example.com/picture.jpg');
  });

  it('throws an error if the google ID is already taken', async () => {
    await expect(
      new SignUpUserCommand({
        googleId: '1',
        email: 'new.john.doe@gmail.com',
        emailVerified: true,
        pictureUrl: 'https://example.com/picture.jpg',
      }).execute(),
    ).rejects.toThrow();
  });

  it('throws an error if the email is already taken', async () => {
    await expect(
      new SignUpUserCommand({
        googleId: 'definitely-not-taken',
        email: 'john.doe@gmail.com',
        emailVerified: true,
        pictureUrl: 'https://example.com/picture.jpg',
      }).execute(),
    ).rejects.toThrow();
  });
});
