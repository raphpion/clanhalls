import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import type User from '../users/user';
import type { UserRelations } from '../users/user';

@Entity()
class Session {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ length: 255 })
  sessionID: string;

  @Column({ length: 255, default: 'credentials' })
  method: string;

  @Column({ length: 64 })
  ipAddress: string;

  @Column({ length: 255 })
  userAgent: string;

  @Column({ nullable: true })
  signedOutAt: Date | null;

  @ManyToOne('User', (user: User) => user.sessions)
  user: Promise<User>;

  @JoinColumn()
  userId: number;

  get isSignedOut() {
    return this.signedOutAt !== null;
  }

  signOut() {
    if (this.signedOutAt) {
      return;
    }

    this.signedOutAt = new Date();
  }
}

export default Session;

export type SessionRelations = 'user' | `user.${UserRelations}`;
