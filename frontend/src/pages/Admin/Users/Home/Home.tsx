import { Fragment } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useDebounce } from 'use-debounce';

import { adminQueryUsers, type AdminQueryUsersParams } from '$api/admin';
import { SortingTableHead } from '$common/Table';
import { usePageTitle } from '$hooks';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '$ui/table';

import View from './View';

const route = getRouteApi('/admin/users');

function AdminUsersHome() {
  usePageTitle('Users');
  const navigate = useNavigate();
  const { order, page, search, sort } = route.useSearch();
  const [debouncedSearch] = useDebounce(search, 500);

  const adminUsersQuery = useQuery({
    queryKey: ['admin-users', page, sort, order, debouncedSearch],
    queryFn: () =>
      adminQueryUsers({
        page,
        search: debouncedSearch,
        orderBy: {
          field: sort,
          order,
        },
      }),
  });

  const handleOrderByChange = (
    field: AdminQueryUsersParams['orderBy']['field'],
  ) =>
    navigate({
      search: (prev) => ({
        ...prev,
        sort: field,
        order: prev.sort === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
      }),
    });

  return (
    <Fragment>
      <h1 className="mb-8 text-3xl font-bold">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <SortingTableHead<AdminQueryUsersParams>
              onClick={handleOrderByChange}
              title="Username"
              field="username"
              orderBy={{ field: sort, order }}
            />
            <SortingTableHead<AdminQueryUsersParams>
              onClick={handleOrderByChange}
              title="Email"
              field="email"
              orderBy={{ field: sort, order }}
            />
            <SortingTableHead<AdminQueryUsersParams>
              onClick={handleOrderByChange}
              title="Enabled"
              field="enabled"
              orderBy={{ field: sort, order }}
            />
            <SortingTableHead<AdminQueryUsersParams>
              onClick={handleOrderByChange}
              title="Super admin"
              field="isSuperAdmin"
              orderBy={{ field: sort, order }}
            />
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <View
            data={adminUsersQuery.data?.items}
            loading={adminUsersQuery.isPending}
            refetch={adminUsersQuery.refetch}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default AdminUsersHome;
