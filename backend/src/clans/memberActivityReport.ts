import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type Clan from './clan';
import type User from '../users/user';

export type MemberActivity = {
  name: string;
  rank: string;
};

@Entity()
class MemberActivityReport {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @CreateDateColumn()
  receivedAt: Date;

  @Column('jsonb')
  data: MemberActivity[];

  @ManyToOne('Clan', (clan: Clan) => clan.memberActivityReports)
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne('User', (user: User) => user.memberActivityReports)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
}

export default MemberActivityReport;

export type MemberActivityReportRelations = 'clan' | 'user';
