import {
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from './users/user';

abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: number | null;

  @Column({ nullable: true })
  updatedBy: number | null;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: Promise<User | null>;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updater: Promise<User | null>;
}

export default BaseEntity;
