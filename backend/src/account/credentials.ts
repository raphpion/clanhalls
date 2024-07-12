import { randomBytes } from 'crypto';

import { hash } from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type User from '../users/user';

@Entity()
class Credentials {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecretHash: string;

  @Column()
  scope: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastUsedAt: Date | null;

  @ManyToOne('User', (user: User) => user.credentials, { onDelete: 'CASCADE' })
  user: Promise<User>;

  generateClientId() {
    this.clientId = randomBytes(16).toString('hex');
  }

  async generateClientSecret() {
    const secret = randomBytes(64).toString('hex');

    this.clientSecretHash = await hash(secret, 10);

    return secret;
  }
}

export default Credentials;

export type CredentialsRelations = 'user';
