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
import type { Title } from '../titles';

export type Settings = {
  name: string;
  ranks: { rank: number; title: Title }[];
};

@Entity()
class SettingsReport {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  receivedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  appliedAt: Date | null = null;

  @Column('jsonb')
  data: Settings;

  @ManyToOne('Clan', (clan: Clan) => clan.settingsReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne('User', (user: User) => user.settingsReports)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Column()
  clanId: number;

  @Column()
  userId: number;
}

export default SettingsReport;
