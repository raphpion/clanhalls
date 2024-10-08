import {
  Column,
  Entity,
  JoinColumn,
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
  readonly clanId: number;

  @Column()
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
