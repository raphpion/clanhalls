import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ClanPlayer from '../clans/clanPlayer';

@Entity()
class Player {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ unique: true, nullable: true, type: 'int' })
  wiseOldManId: number | null = null;

  @Column({ unique: true, length: 12 })
  username: string;

  @OneToMany(() => ClanPlayer, (clanPlayer: ClanPlayer) => clanPlayer.player)
  clanPlayers: Promise<ClanPlayer[]>;
}

export default Player;
