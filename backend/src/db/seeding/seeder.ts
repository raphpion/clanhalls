import { readFile } from 'fs/promises';
import { join } from 'path';

import type Joi from 'joi';
import { type DataSource } from 'typeorm';
import YAML from 'yaml';

import type SeedingService from './seedingService';
import type ConfigService from '../../config';

abstract class Seeder<Entity, Schema, Identifier = string> {
  public abstract readonly entityName: string;

  protected abstract readonly schema: Joi.Schema<Record<string, Schema>>;
  protected readonly entityMapping = new Map<string, Entity>();

  constructor(
    protected readonly seedingService: SeedingService,
    protected readonly configService: ConfigService,
    protected readonly db: DataSource,
  ) {}

  public async seed() {
    const seeds = await this.getSeedData();
    if (!seeds) {
      return;
    }

    const identifierToKeyMap = new Map<Identifier, string>();
    const entities = await Promise.all(
      Object.entries(seeds).map(async ([key, seed]) => {
        const entity = this.deserialize(seed);
        let identifier = this.getIdentifier(entity);
        if (identifier instanceof Promise) {
          identifier = await identifier;
        }

        identifierToKeyMap.set(identifier, key);

        return entity;
      }),
    );

    const savedEntities = await this.db
      .getRepository<Entity>(this.entityName)
      .save(entities);

    savedEntities.forEach(async (entity) => {
      let identifier = this.getIdentifier(entity);
      if (identifier instanceof Promise) {
        identifier = await identifier;
      }

      if (!identifierToKeyMap.has(identifier)) return;

      this.entityMapping.set(identifierToKeyMap.get(identifier)!, entity);
    });
  }

  public getEntity(key: string): Entity | null {
    return this.entityMapping.get(key) || null;
  }

  protected abstract deserialize(seed: Schema): Entity;

  protected abstract getIdentifier(
    entity: Entity,
  ): Identifier | Promise<Identifier>;

  private async getSeedData(): Promise<Record<string, Schema> | undefined> {
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

export default Seeder;
