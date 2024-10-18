import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import Clan from './clan';

@Entity()
@Unique(['rank', 'clan'])
class ClanRank {
  @PrimaryColumn()
  readonly clanId: number;

  @PrimaryColumn()
  rank: string;

  @Column()
  title: string;

  @ManyToOne(() => Clan, (clan: Clan) => clan.clanRanks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clanId' })
  clan: Promise<Clan>;
}

export default ClanRank;
