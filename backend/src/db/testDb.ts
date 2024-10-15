import { DataSource } from 'typeorm';

import { entities, migrations } from '.';

const testDb = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities,
  migrations,
});

export default testDb;
