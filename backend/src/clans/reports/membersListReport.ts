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

export type ListMember = {
  name: string;
  rank: number;
};

@Entity()
class MembersListReport {
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
  data: ListMember[];

  @ManyToOne('Clan', (clan: Clan) => clan.memberActivityReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne('User', (user: User) => user.memberActivityReports)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Column()
  clanId: number;

  @Column()
  userId: number;
}

export default MembersListReport;
