import { randomBytes } from 'crypto';

import { compare, hash } from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from '../user';

export enum Scopes {
  CLAN_REPORTING = 'clan:reporting',
}

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
  lastUsedAt: Date | null = null;

  @ManyToOne(() => User, (user: User) => user.credentials, {
    onDelete: 'CASCADE',
  })
  user: Promise<User>;

  generateClientId() {
    this.clientId = randomBytes(16).toString('hex');
  }

  async generateClientSecret() {
    const secret = randomBytes(64).toString('hex');

    this.clientSecretHash = await hash(secret, 10);

    return secret;
  }

  async validateClientSecret(clientSecret: string) {
    return compare(clientSecret, this.clientSecretHash);
  }

  validateScope(scope: Scopes[]) {
    const parsedScope = this.scope.split(',');

    return scope.every((s) => parsedScope.includes(s));
  }
}

export default Credentials;
