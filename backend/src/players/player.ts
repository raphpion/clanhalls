import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type ClanPlayer from '../clans/clanPlayer';

@Entity()
class Player {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ unique: true, length: 12 })
  username: string;

  @Column({ nullable: true, length: 12 })
  previousUsername: string;

  @Column({ nullable: true })
  usernameChangedAt: Date;

  @OneToMany('ClanPlayer', (clanPlayer: ClanPlayer) => clanPlayer.player)
  clanPlayers: Promise<ClanPlayer[]>;
}

export default Player;

export type ClanPlayerRelations = 'clan' | 'player';
