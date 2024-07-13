import slugify from 'slugify';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ClanPlayer from './clanPlayer';
import ClanRank from './clanRank';
import ClanUser from './clanUser';
import MemberActivityReport from './reports/memberActivityReport';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type Player from '../players/player';
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
    () => MemberActivityReport,
    (memberActivityReport: MemberActivityReport) => memberActivityReport.clan,
    {
      cascade: true,
    }
  )
  memberActivityReports: Promise<MemberActivityReport[]>;

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

  async addOrUpdatePlayer(player: Player, rank: string, lastSeenAt: Date) {
    const clanPlayers = await this.clanPlayers;

    const existingClanUser = clanPlayers.find(
      (clanPlayer) => clanPlayer.playerId === player.id
    );

    if (existingClanUser) {
      existingClanUser.rank = rank;
      existingClanUser.lastSeenAt = lastSeenAt;

      return;
    }

    const clanPlayer = new ClanPlayer();
    clanPlayer.player = Promise.resolve(player);
    clanPlayer.clan = Promise.resolve(this);
    clanPlayer.rank = rank;
    clanPlayer.lastSeenAt = lastSeenAt;

    clanPlayers.push(clanPlayer);
  }
}

export default Clan;
