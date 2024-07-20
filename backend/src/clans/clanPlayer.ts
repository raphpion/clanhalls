import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import Clan from './clan';
import Player from '../players/player';

@Entity()
class ClanPlayer {
  @PrimaryColumn()
  readonly clanId: number;

  @PrimaryColumn()
  readonly playerId: number;

  @Column()
  lastSeenAt: Date;

  @Column()
  rank: string;

  @OneToOne(() => Clan, (clan: Clan) => clan.clanPlayers)
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;

  @ManyToOne(() => Player, (player: Player) => player.clanPlayers)
  @JoinColumn({ name: 'playerId' })
  player: Promise<Player>;
}

export default ClanPlayer;
