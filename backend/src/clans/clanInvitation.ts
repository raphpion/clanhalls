import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Clan from './clan';
import ClanUser from './clanUser';
import AppError, { AppErrorCodes } from '../extensions/errors';
import User from '../users/user';

@Entity()
class ClanInvitation {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ nullable: true })
  description: string | null = null;

  @ManyToOne(() => Clan, (clan: Clan) => clan.clanInvitations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne(() => User, (user: User) => user.clanInvitationsSent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' })
  sender: Promise<User>;

  @OneToMany(() => ClanUser, (clanUser: ClanUser) => clanUser.clanInvitation, {
    onDelete: 'CASCADE',
  })
  users: Promise<User[]>;

  @Column()
  clanId: number;

  @Column()
  senderId: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  disabledAt: Date | null = null;

  @Column({ nullable: true })
  maxUses: number | null = null;

  @Column({ default: 0 })
  uses: number;

  get isAvailable() {
    return (
      this.disabledAt === null &&
      (this.expiresAt === null || this.expiresAt > new Date()) &&
      (this.maxUses === null || this.uses < this.maxUses)
    );
  }

  disable() {
    if (this.disabledAt !== null) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Invitation is already disabled',
      );
    }

    this.disabledAt = new Date();
  }

  enable() {
    if (this.disabledAt === null) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Invitation is already enabled',
      );
    }

    this.disabledAt = null;
  }
}

export default ClanInvitation;
