import { inject, injectable } from 'tsyringe';
import type { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

import ClanPlayerSeeder from './clanPlayerSeeder';
import ClanRankSeeder from './clanRankSeeder';
import ClanSeeder from './clanSeeder';
import ClanUserSeeder from './clanUserSeeder';
import MemberActivityReportSeeder from './memberActivityReportSeeder';
import PlayerSeeder from './playerSeeder';
import type Seeder from './seeder';
import SettingsReportSeeder from './settingsReportSeeder';
import UserSeeder from './userSeeder';
import { entities } from '..';
import type ConfigService from '../../config';

@injectable()
class SeedingService {
  private readonly seedingEntityOrder = [
    // Strong entities
    ClanSeeder,
    PlayerSeeder,
    UserSeeder,
    // Weak entities
    ClanPlayerSeeder,
    ClanRankSeeder,
    ClanUserSeeder,
    MemberActivityReportSeeder,
    SettingsReportSeeder,
    // Add more seeders here...
  ];

  private readonly seederTypeMap = new Map<string, EntityTarget<ObjectLiteral>>(
    entities.map((e) => [e.name, e]),
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
  ): Entity | null {
    const seeder = this.seederMap.get(entity);
    if (!seeder) return null;

    return seeder.getEntity(key) as Entity;
  }
}

export default SeedingService;
