
import type {
  PaginatedQueryParams,
  PaginatedQueryResult,
} from '../../db/queries';
import { resolvePaginatedQuery } from '../../db/queries';
import Query from '../../query';
import type Clan from '../clan';
import ClanPlayer from '../clanPlayer';
import CLAN_RANKS from '../ranks';

export type Params = PaginatedQueryParams<{
  clan: Clan;
  search: string;
  orderBy: {
    field: 'username' | 'rank' | 'lastSeenAt';
    order: 'ASC' | 'DESC';
  };
  inactiveFor?: '1week' | '1month' | '3months' | '6months' | '1year';
}>;

export type ClanPlayerData = {
  uuid: string;
  username: string;
  rank: string;
  title: string | undefined;
  lastSeenAt: Date;
};

type Result = PaginatedQueryResult<ClanPlayerData>;

class ClanPlayersQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(ClanPlayer);

    const { clan, ...params } = this.params;

    const sort = (() => {
      if (params.orderBy.field === 'rank') {
        return `CASE clanPlayer.rank ${CLAN_RANKS.map(
          (rank, index) => `WHEN '${rank}' THEN ${index}`,
        ).join(' ')} ELSE ${CLAN_RANKS.length} END`;
      }

      if (params.orderBy.field === 'username') {
        return 'player.username';
      }

      return `clanPlayer.${params.orderBy.field}`;
    })();

    const query = repository
      .createQueryBuilder('clanPlayer')
      .leftJoinAndSelect('clanPlayer.player', 'player')
      .where('clanPlayer.clanId = :clanId', { clanId: clan.id })
      .andWhere('player.username ILIKE :search', {
        search: `%${params.search}%`,
      });

    if (params.inactiveFor) {
      query.andWhere(
        `clanPlayer.lastSeenAt <= NOW() - INTERVAL '${params.inactiveFor}'`,
      );
    }

    if (params.orderBy.field === 'rank') {
      query
        .addSelect(sort, 'rank_order')
        .orderBy('rank_order', params.orderBy.order);
    } else {
      query.orderBy(sort, params.orderBy.order);
    }

    const { items, ...queryResult } = await resolvePaginatedQuery(
      query,
      params,
    );

    const clanRanks = await clan.clanRanks;
    const clanPlayers: ClanPlayerData[] = await Promise.all(
      items.map(async (clanPlayer) => {
        const player = await clanPlayer.player;
        const { uuid, username } = player;
        const { rank, lastSeenAt } = clanPlayer;
        const title = clanRanks.find((r) => r.rank === rank)?.title;

        return {
          uuid,
          username,
          rank,
          title,
          lastSeenAt,
        };
      }),
    );

    return { ...queryResult, items: clanPlayers };
  }
}

export default ClanPlayersQuery;
