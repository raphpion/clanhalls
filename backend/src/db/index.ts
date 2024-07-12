import path from 'path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import Credentials from '../account/credentials';
import Clan from '../clans/clan';
import ClanPlayer from '../clans/clanPlayer';
import ClanUser from '../clans/clanUser';
import MemberActivityReport from '../clans/memberActivityReport';
import Player from '../players/player';
import Session from '../sessions/session';
import User from '../users/user';

config({ path: path.join(__dirname, '../../../.env') });

const db = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  logger: 'file',
  entities: [
    Clan,
    ClanPlayer,
    ClanUser,
    Credentials,
    MemberActivityReport,
    Player,
    Session,
    User,
  ],
  subscribers: [],
  migrations: [__dirname + '/migrations/**/*.ts'],
});

export default db;
