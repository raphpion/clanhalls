import path from 'path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import Clan from '../clans/clan';
import ClanInvitation from '../clans/clanInvitation';
import ClanPlayer from '../clans/clanPlayer';
import ClanRank from '../clans/clanRank';
import ClanUser from '../clans/clanUser';
import MemberActivityReport from '../clans/reports/memberActivityReport';
import MembersListReport from '../clans/reports/membersListReport';
import SettingsReport from '../clans/reports/settingsReport';
import Player from '../players/player';
import Session from '../sessions/session';
import Credentials from '../users/credentials/credentials';
import User from '../users/user';

config({ path: path.join(__dirname, '../../../.env') });

const isTest = process.env.NODE_ENV === 'test';

export const entities = [
  Clan,
  ClanInvitation,
  ClanPlayer,
  ClanRank,
  ClanUser,
  Credentials,
  MemberActivityReport,
  MembersListReport,
  Player,
  SettingsReport,
  Session,
  User,
];

export const migrations = [
  __dirname + '/migrations/**/*.ts',
  __dirname + '/migrations/**/*.js',
];
export const subscribers = [
  __dirname + '/subscribers/**/*.ts',
  __dirname + '/subscribers/**/*.js',
];

const db = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: isTest ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB,
  synchronize: isTest,
  dropSchema: isTest,
  logging: process.env.NODE_ENV !== 'production',
  logger: 'file',
  entities,
  subscribers: isTest ? [] : subscribers,
  migrations,
});

export default db;
