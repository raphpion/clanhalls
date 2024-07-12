import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type Clan from './clan';

export type MemberActivity = {
  name: string;
  rank: string;
  prevName?: string;
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

  @OneToMany('Clan', (clan: Clan) => clan.memberActivityReports)
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;
}

export default MemberActivityReport;

export type MemberActivityReportRelations = 'clan';
