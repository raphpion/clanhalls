import { readFile } from 'fs/promises';
import { join } from 'path';

import Joi from 'joi';
import { injectable } from 'tsyringe';
import { type DataSource } from 'typeorm';
import YAML from 'yaml';

import type SeedingService from './seedingService';
import Clan from '../../clans/clan';
import ClanUser from '../../clans/clanUser';
import type ConfigService from '../../config';
import User from '../../users/user';

type ClanSeeding = Record<
  string,
  {
    name: string;
  }
>;

type ClanUserSeeding = Record<
  string,
  {
    clan: string;
    user: string;
    admin: boolean;
  }
>;

type UserSeeding = Record<
  string,
  {
    googleId: string;
    username: string;
    email: string;
  }
>;

const clanSeedingSchema = Joi.object<ClanSeeding>().pattern(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
  }),
);

const userSeedingSchema = Joi.object<UserSeeding>().pattern(
  Joi.string(),
  Joi.object({
    googleId: Joi.number()
      .integer()
      .strict()
      .custom((v) => v.toString())
      .required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
);

const clanUserSeedingSchema = Joi.object<ClanUserSeeding>().pattern(
  Joi.string(),
  Joi.object({
    clan: Joi.string().required(),
    user: Joi.string().required(),
    admin: Joi.boolean().required(),
  }),
);

export abstract class Seeder<TEntity, TSchema = number> {
  public abstract readonly entityName: string;

  protected abstract readonly schema: Joi.Schema<TSchema>;
  protected readonly entityMapping = new Map<string, TEntity>();

  constructor(
    protected readonly seedingService: SeedingService,
    protected readonly configService: ConfigService,
    protected readonly db: DataSource,
  ) {}

  public abstract seed(): Promise<void>;

  public getEntity(key: string): TEntity | null {
    return this.entityMapping.get(key) || null;
  }

  protected async getSeedingData(): Promise<TSchema | undefined> {
    try {
      const seedFileData = await readFile(this.seedPath, 'utf-8');
      const seedFileJson = YAML.parse(seedFileData);
      return this.schema.validateAsync(seedFileJson);
    } catch (e) {
      console.log(e);
      return;
    }
  }

  private get seedPath() {
    const env = this.configService.get((c) => c.env);

    // Convert the seeder class name to kebab-case
    const seederName = this.constructor.name
      .replace('Seeder', '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();

    return join(__dirname, `./${env}/${seederName}.yml`);
  }
}

@injectable()
export class ClanSeeder extends Seeder<Clan, ClanSeeding> {
  entityName = Clan.name;
  schema = clanSeedingSchema;

  public async seed() {
    const seeds = await this.getSeedingData();
    if (!seeds) {
      return;
    }

    const mapping = new Map<string, string>();
    const clans = Object.entries(seeds).map(([key, seed]) => {
      const clan = new Clan();
      clan.name = seed.name;
      clan.nameNormalized = Clan.normalizeName(seed.name);

      mapping.set(clan.name, key);

      return clan;
    });

    const savedClans = await this.db.getRepository(Clan).save(clans);

    savedClans.forEach((clan) => {
      if (!mapping.has(clan.name)) return;

      this.entityMapping.set(mapping.get(clan.name), clan);
    });
  }
}

@injectable()
export class UserSeeder extends Seeder<User, UserSeeding> {
  entityName = User.name;
  schema = userSeedingSchema;

  public async seed() {
    const seeds = await this.getSeedingData();
    if (!seeds) {
      return;
    }

    const mapping = new Map<string, string>();
    const users = Object.entries(seeds).map(([key, seed]) => {
      const user = new User();
      user.googleId = seed.googleId;
      user.username = seed.username;
      user.usernameNormalized = User.normalizeUsername(seed.username);
      user.email = seed.email;
      user.emailNormalized = User.normalizeEmail(seed.email);

      mapping.set(user.username, key);

      return user;
    });

    const savedUsers = await this.db.getRepository(User).save(users);
    savedUsers.forEach((user) => {
      if (!mapping.has(user.username)) return;

      this.entityMapping.set(mapping.get(user.username), user);
    });
  }
}

@injectable()
export class ClanUserSeeder extends Seeder<ClanUser, ClanUserSeeding> {
  entityName = ClanUser.name;
  schema = clanUserSeedingSchema;

  public async seed() {
    const seeds = await this.getSeedingData();
    if (!seeds) {
      return;
    }

    const mapping = new Map<string, string>();
    const clanUsers = Object.entries(seeds).map(([key, seed]) => {
      const clan = this.seedingService.getEntity(Clan, seed.clan);
      if (!clan) {
        console.log(`Clan not found: ${seed.clan}. Skipping...`);
        return;
      }

      const user = this.seedingService.getEntity(User, seed.user);
      if (!user) {
        console.log(`User not found: ${seed.user}. Skipping...`);
        return;
      }

      const clanUser = new ClanUser();
      clanUser.clan = Promise.resolve(clan);
      clanUser.user = Promise.resolve(user);
      clanUser.isAdmin = seed.admin;

      mapping.set(`${clan.id}-${user.id}`, key);

      return clanUser;
    });

    const savedClanUsers = await this.db
      .getRepository(ClanUser)
      .save(clanUsers);

    savedClanUsers.forEach(async (clanUser) => {
      const [clan, user] = await Promise.all([clanUser.clan, clanUser.user]);
      if (!mapping.has(`${clan.id}-${user.id}`)) return;

      this.entityMapping.set(mapping.get(`${clan.id}-${user.id}`), clanUser);
    });
  }
}
