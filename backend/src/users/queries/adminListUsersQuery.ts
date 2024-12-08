import {
  resolvePaginatedQuery,
  type PaginatedQueryParams,
  type PaginatedQueryResult,
} from '../../db/queries';
import Query from '../../query';
import User from '../user';

export type Params = PaginatedQueryParams<{
  search: string;
  orderBy: {
    field: 'username' | 'email' | 'enabled' | 'isSuperAdmin';
    order: 'ASC' | 'DESC';
  };
}>;

export type AdminListUsersData = {
  googleId: string;
  username: string | null;
  email: string;
  pictureUrl: string | null;
  enabled: boolean;
  isSuperAdmin: boolean;
};

type Result = PaginatedQueryResult<AdminListUsersData>;

class AdminListUsersQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);

    const { search, orderBy, ...params } = this.params;

    const query = repository
      .createQueryBuilder('user')
      .where('user.username ILIKE :search OR user.email ILIKE :search', {
        search: `%${search}%`,
      });

    if (orderBy.field === 'enabled') {
      query.orderBy('user.disabledAt', orderBy.order);
    } else {
      query.orderBy(`user.${orderBy.field}`, orderBy.order);
    }

    const { items, ...queryResult } = await resolvePaginatedQuery(
      query,
      params,
    );

    const users: AdminListUsersData[] = items.map((user) => ({
      googleId: user.googleId,
      username: user.username,
      email: user.email,
      pictureUrl: user.pictureUrl,
      enabled: user.disabledAt === null,
      isSuperAdmin: user.isSuperAdmin,
    }));

    return { ...queryResult, items: users };
  }
}

export default AdminListUsersQuery;
