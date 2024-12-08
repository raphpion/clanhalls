import { createFileRoute } from '@tanstack/react-router';

import { type AdminQueryUsersParams } from '$api/admin';
import AdminUsersHome from '$pages/Admin/Users/Home/Home';

export type AdminUsersRouteParams = {
  page: number;
  search: string;
  sort: AdminQueryUsersParams['orderBy']['field'];
  order: AdminQueryUsersParams['orderBy']['order'];
};

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersHome,
  validateSearch: (search: Record<string, unknown>): AdminUsersRouteParams => {
    return {
      page: Number(search.page) || 1,
      search: String(search.search) || '',
      sort: (search.sort as AdminUsersRouteParams['sort']) || 'username',
      order: (search.order as AdminUsersRouteParams['order']) || 'ASC',
    };
  },
});

