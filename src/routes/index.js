import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import {
  Page404,
  LoginPage,
  EventListPage,
  AttendListPage,
  HostPage,
  UserEditPage,
  NewEventPage,
  RequestHostPage,
  LinkQRScanPage,
} from './elements';
import { PATH_DASHBOARD } from './paths';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'qr',
          element: <LinkQRScanPage />,
        },
      ],
    },
    {
      path: '/event',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'all', element: <EventListPage /> },
        { path: 'list', element: <AttendListPage /> },
        { path: 'user', element: <UserEditPage /> },
        {
          path: 'host',
          children: [
            { element: <Navigate to={PATH_DASHBOARD.host.list} replace />, index: true },
            { path: 'list', element: <HostPage /> },
            { path: 'new', element: <NewEventPage /> },
            { path: 'request', element: <RequestHostPage /> },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
