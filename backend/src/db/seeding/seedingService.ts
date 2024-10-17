import { inject, injectable } from 'tsyringe';
import type { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

import type { Seeder } from './seeders';
import { ClanSeeder, ClanUserSeeder, UserSeeder } from './seeders';
import Clan from '../../clans/clan';
import ClanUser from '../../clans/clanUser';
import type ConfigService from '../../config';
import User from '../../users/user';

@injectable()
class SeedingService {
  private readonly seedingEntityOrder = [
    // Strong entities
    ClanSeeder,
    UserSeeder,
    // Weak entities
    ClanUserSeeder,
    // Add more seeders here
  ];

  private readonly seederTypeMap = new Map<string, EntityTarget<ObjectLiteral>>(
    [Clan, User, ClanUser].map((e) => [e.name, e]),
  );

  private readonly seederMap = new Map<
    EntityTarget<ObjectLiteral>,
    Seeder<ObjectLiteral, unknown>
  >();

  constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
    @inject('DataSource') private readonly db: DataSource,
  ) {}

  public async initialize() {
    await this.db.initialize();

    for (const seeder of this.seedingEntityOrder) {
      const instance = new seeder(this, this.configService, this.db);
      await instance.seed();
      this.seederMap.set(this.seederTypeMap.get(instance.entityName), instance);
    }
  }

  public clear() {
    this.db.destroy();
    this.seederMap.clear();
  }

  public getEntity<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    key: string,
  ): Entity | undefined {
    const seeder = this.seederMap.get(entity);
    if (!seeder) return undefined;

    return seeder.getEntity(key) as Entity;
  }
}

export default SeedingService;
