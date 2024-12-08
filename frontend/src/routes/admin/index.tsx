import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    throw redirect({
      to: '/admin/users',
      search: { page: 1, search: '', sort: 'username', order: 'ASC' },
    });
  },
});

