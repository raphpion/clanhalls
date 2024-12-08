import Joi from 'joi';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';

import Credentials from './credentials/credentials';
import BaseEntity from '../baseEntity';
import ClanUser from '../clans/clanUser';
import MemberActivityReport from '../clans/reports/memberActivityReport';
import SettingsReport from '../clans/reports/settingsReport';
import AppError, { AppErrorCodes } from '../extensions/errors';
import Session from '../sessions/session';

@Entity()
class User extends BaseEntity {
  @Column({ unique: true, length: 255 })
  googleId: string;

  @Column({ length: 25, nullable: true, unique: true })
  username: string | null;

  @Column({ length: 25, nullable: true, unique: true })
  usernameNormalized: string | null;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  emailNormalized: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  pictureUrl: string | null;

  @Column({ nullable: false, default: false })
  isSuperAdmin: boolean;

  @Column({ nullable: true })
  disabledAt: Date | null;

  @OneToOne(() => ClanUser, (clanUser: ClanUser) => clanUser.user)
  clanUser: Promise<ClanUser | null>;

  @OneToMany(() => Credentials, (credentials: Credentials) => credentials.user)
  credentials: Promise<Credentials[]>;

  @OneToMany(
    () => MemberActivityReport,
    (memberActivityReport: MemberActivityReport) => memberActivityReport.user,
  )
  memberActivityReports: Promise<MemberActivityReport[]>;

  @OneToMany(
    () => SettingsReport,
    (settingsReport: SettingsReport) => settingsReport.user,
  )
  settingsReports: Promise<SettingsReport[]>;

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Promise<Session[]>;

  get isDisabled() {
    return this.disabledAt !== null;
  }

  static normalizeEmail(email: string) {
    if (Joi.string().email().validate(email).error) {
      throw new AppError(
        AppErrorCodes.INVALID_PARAMETER,
        `Invalid email address: ${email}`,
      );
    }

    return email.trim().toLowerCase();
  }

  static normalizeUsername(username: string) {
    return username.trim().toLowerCase();
  }

  changeEmail(email: string) {
    if (Joi.string().email().validate(email).error) {
      throw new AppError(
        AppErrorCodes.INVALID_PARAMETER,
        `Invalid email address: ${email}`,
      );
    }

    const emailNormalized = User.normalizeEmail(email);

    this.email = email;
    this.emailNormalized = emailNormalized;
    this.emailVerified = false;
  }

  disable() {
    if (this.disabledAt) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is already disabled');
    }

    this.disabledAt = new Date();
  }

  enable() {
    if (!this.disabledAt) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not disabled');
    }

    this.disabledAt = null;
  }

  setPictureUrl(pictureUrl: string | null) {
    if (pictureUrl === this.pictureUrl) {
      return;
    }

    if (pictureUrl === null) {
      this.pictureUrl = null;
      return;
    }

    try {
      const url = new URL(pictureUrl || '');

      this.pictureUrl = url.toString();
    } catch (error) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'Invalid picture URL');
    }
  }

  setUsername(username: string) {
    if (this.username) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'Username is already set');
    }

    this.username = username;
    this.usernameNormalized = User.normalizeUsername(username);
  }

  verifyEmail() {
    if (this.emailVerified) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Email is already verified',
      );
    }

    this.emailVerified = true;
  }
}

export default User;
