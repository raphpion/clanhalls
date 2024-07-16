import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import Clan from './clan';
import type { PaginatedQueryParams } from '../db/queries';
import Player from '../players/player';

export type ClanPlayerQueryData = {
  uuid: string;
  username: string;
  rank: string;
  title: string | undefined;
  lastSeenAt: Date;
};

export type ClanPlayerQueryParams = PaginatedQueryParams<{
  search: string;
  orderBy: {
    field: 'username' | 'rank' | 'lastSeenAt';
    order: 'ASC' | 'DESC';
  };
}>;

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
