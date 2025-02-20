import {
  resolvePaginatedQuery,
  type PaginatedQueryParams,
  type PaginatedQueryResult,
} from '../../db/queries';
import Query from '../../query';
import type Clan from '../clan';
import ClanInvitation from '../clanInvitation';

export type Params = PaginatedQueryParams<{
  clan: Clan;
  search: string;
  expired?: boolean;
  disabled?: boolean;
  used?: boolean;
  orderBy: {
    field: 'description' | 'expiresAt' | 'maxUses' | 'sender' | 'uses';
    order: 'ASC' | 'DESC';
  };
}>;

export type ClanInvitationData = {
  uuid: string;
  description: string | null;
  sender: {
    username: string;
    pictureUrl: string | null;
  };
  disabledAt: Date | null;
  expiresAt: Date | null;
  maxUses: number | null;
  uses: number;
};

type Result = PaginatedQueryResult<ClanInvitationData>;

class ClanInvitationsQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(ClanInvitation);

    const { clan, ...params } = this.params;

    const sort = (() => {
      if (params.orderBy.field === 'sender') return 'sender.username';

      return `clanInvitation.${params.orderBy.field}`;
    })();

    let query = repository
      .createQueryBuilder('clanInvitation')
      .leftJoinAndSelect('clanInvitation.sender', 'sender')
      .where('clanInvitation.clanId = :clanId', { clanId: clan.id });

    if (params.search) {
      query = query.andWhere('clanInvitation.description ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    if (params.expired === true) {
      query = query.andWhere('clanInvitation.expiresAt <= NOW()');
    } else if (params.expired === false) {
      query = query.andWhere(
        '(clanInvitation.expiresAt IS NULL OR clanInvitation.expiresAt > NOW())',
      );
    }

    if (params.disabled === true) {
      query = query.andWhere('clanInvitation.disabledAt IS NOT NULL');
    } else if (params.disabled === false) {
      query = query.andWhere('clanInvitation.disabledAt IS NULL');
    }

    if (params.used === true) {
      query = query.andWhere(
        '(clanInvitation.maxUses IS NOT NULL AND clanInvitation.uses >= clanInvitation.maxUses)',
      );
    } else if (params.used === false) {
      query = query.andWhere(
        '(clanInvitation.maxUses IS NULL OR clanInvitation.uses < clanInvitation.maxUses)',
      );
    }

    query = query.orderBy(sort, params.orderBy.order);

    const { items, ...queryResult } = await resolvePaginatedQuery(
      query,
      params,
    );

    const clanInvitations: ClanInvitationData[] = await Promise.all(
      items.map(async (clanInvitation) => {
        const sender = await clanInvitation.sender;
        const { username, pictureUrl } = sender;
        const {
          uuid,
          code,
          description,
          disabledAt,
          expiresAt,
          maxUses,
          uses,
        } = clanInvitation;

        return {
          uuid,
          code,
          description,
          sender: { username, pictureUrl },
          disabledAt,
          expiresAt,
          maxUses,
          uses,
        };
      }),
    );

    return { ...queryResult, items: clanInvitations };
  }
}

export default ClanInvitationsQuery;
