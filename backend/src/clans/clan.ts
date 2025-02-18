import slugify from 'slugify';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ClanInvitation from './clanInvitation';
import ClanPlayer from './clanPlayer';
import ClanRank from './clanRank';
import ClanUser from './clanUser';
import MemberActivityReport from './reports/memberActivityReport';
import SettingsReport from './reports/settingsReport';
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

  @Column({ length: 20, nullable: true })
  nameInGame: string | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncedAt: Date | null;

  @OneToMany(() => ClanUser, (clanUser: ClanUser) => clanUser.clan, {
    cascade: true,
  })
  clanUsers: Promise<ClanUser[]>;

  @OneToMany(() => ClanPlayer, (clanPlayer: ClanPlayer) => clanPlayer.clan, {
    cascade: true,
  })
  clanPlayers: Promise<ClanPlayer[]>;

  @OneToMany(() => ClanRank, (clanRank: ClanRank) => clanRank.clan, {
    cascade: true,
  })
  clanRanks: Promise<ClanRank[]>;

  @OneToMany(
    () => ClanInvitation,
    (clanInvitation: ClanInvitation) => clanInvitation.clan,
    {
      cascade: true,
    },
  )
  clanInvitations: Promise<ClanInvitation[]>;

  @OneToMany(
    () => MemberActivityReport,
    (memberActivityReport: MemberActivityReport) => memberActivityReport.clan,
    {
      cascade: true,
    },
  )
  memberActivityReports: Promise<MemberActivityReport[]>;

  @OneToMany(
    () => SettingsReport,
    (settingsReport: SettingsReport) => settingsReport.clan,
    {
      cascade: true,
    },
  )
  settingsReports: Promise<SettingsReport[]>;

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
      (clanUser) => clanUser.userId === user.id,
    );

    if (existingClanUser) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is already in this clan',
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
