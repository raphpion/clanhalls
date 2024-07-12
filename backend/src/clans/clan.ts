import slugify from 'slugify';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ClanUser from './clanUser';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type User from '../users/user';

@Entity()
class Clan {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  nameNormalized: string;

  @OneToMany('ClanUser', (clanUser: ClanUser) => clanUser.clan)
  clanUsers: Promise<ClanUser[]>;

  static normalizeName(name: string) {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'en',
    });
  }

  async addUser(user: User, isAdmin = false) {
    const clanUsers = await this.clanUsers;

    const existingClanUser = clanUsers.find(
      (clanUser) => clanUser.userId === user.id
    );

    if (existingClanUser) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is already in this clan'
      );
    }

    const clanUser = new ClanUser();
    clanUser.user = Promise.resolve(user);
    clanUser.clan = Promise.resolve(this);
    clanUser.isAdmin = isAdmin;

    clanUsers.push(clanUser);
  }
}

export default Clan;

export type ClanRelations = 'clanUsers';
