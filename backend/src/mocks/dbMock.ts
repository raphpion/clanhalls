import { DataSource } from 'typeorm';

import { entities, migrations } from '../db';

const dbMock = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities,
  migrations,
});

export default dbMock;
