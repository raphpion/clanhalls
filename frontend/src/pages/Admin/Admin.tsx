import { Outlet } from '@tanstack/react-router';

import AppLayout from '$common/AppLayout';
import { usePageTitle } from '$hooks';

function Admin() {
  usePageTitle('Admin');

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default Admin;
