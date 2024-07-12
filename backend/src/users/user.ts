import Joi from 'joi';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type Credentials from '../account/credentials';
import type ClanUser from '../clans/clanUser';
import type { ClanUserRelations } from '../clans/clanUser';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type Session from '../sessions/session';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, length: 255 })
  googleId: string;

  @Column({ length: 25, nullable: true, unique: true })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  emailNormalized: string;

  @Column({ default: false })
  emailVerified: boolean;

  @OneToOne('ClanUser', (clanUser: ClanUser) => clanUser.user)
  clanUser: Promise<ClanUser>;

  @OneToMany('Credentials', (credentials: Credentials) => credentials.user)
  credentials: Promise<Credentials[]>;

  @OneToMany('Session', (session: Session) => session.user)
  sessions: Promise<Session[]>;

  static normalizeEmail(email: string) {
    if (Joi.string().email().validate(email).error) {
      throw new AppError(
        AppErrorCodes.INVALID_PARAMETER,
        `Invalid email address: ${email}`
      );
    }

    return email.trim().toLowerCase();
  }

  get clan() {
    return Promise.resolve(this.clanUser).then((clanUser) => clanUser?.clan);
  }

  changeEmail(email: string) {
    if (Joi.string().email().validate(email).error) {
      throw new AppError(
        AppErrorCodes.INVALID_PARAMETER,
        `Invalid email address: ${email}`
      );
    }

    const emailNormalized = User.normalizeEmail(email);

    this.email = email;
    this.emailNormalized = emailNormalized;
    this.emailVerified = false;
  }

  setUsername(username: string) {
    if (this.username) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'Username is already set');
    }

    this.username = username;
  }

  verifyEmail() {
    if (this.emailVerified) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Email is already verified'
      );
    }

    this.emailVerified = true;
  }
}

export default User;

export type UserRelations =
  | 'clanUser'
  | `clanUser.${ClanUserRelations}`
  | 'credentials'
  | 'sessions';
