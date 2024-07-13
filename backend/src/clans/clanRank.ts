import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import Clan from './clan';

@Entity()
@Unique(['rank', 'clan'])
class ClanRank {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  rank: string;

  @Column()
  title: string;

  @ManyToOne(() => Clan, (clan: Clan) => clan.clanRanks)
  clan: Clan;
}

export default ClanRank;
