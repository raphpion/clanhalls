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

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecretHash: string;

  @Column()
  scope: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lastUsedAt: Date;

  @ManyToOne('User', (user: User) => user.credentials, { onDelete: 'CASCADE' })
  user: Promise<User>;
}

export default Credentials;

export type CredentialsRelations = 'user';
