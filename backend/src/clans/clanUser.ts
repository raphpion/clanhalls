import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import type Clan from './clan';
import type User from '../users/user';

@Entity()
class ClanUser {
  @PrimaryColumn()
  readonly clanId: number;

  @PrimaryColumn()
  readonly userId: number;

  @Column({ default: false })
  isAdmin: boolean;

  @ManyToOne('Clan', (clan: Clan) => clan.clanUsers)
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @OneToOne('User', (user: User) => user.clanUser)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
}

export default ClanUser;

export type ClanUserRelations = 'clan' | 'user';
