import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type User from '../../users/user';
import type Clan from '../clan';
import type { Rank } from '../ranks';
import type { Title } from '../titles';

export type Settings = {
  name: string;
  ranks: Record<Rank, Title>;
};

@Entity()
class SettingsReport {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @CreateDateColumn()
  receivedAt: Date;

  @Column({ nullable: true })
  appliedAt: Date | null = null;

  @Column('jsonb')
  data: Settings;

  @ManyToOne('Clan', (clan: Clan) => clan.memberActivityReports)
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne('User', (user: User) => user.memberActivityReports)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
}

export default SettingsReport;
