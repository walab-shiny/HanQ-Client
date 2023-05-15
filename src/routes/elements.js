import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const EventListPage = Loadable(lazy(() => import('../pages/EventListPage')));
export const AttendListPage = Loadable(lazy(() => import('../pages/AttendListPage')));
export const UserEditPage = Loadable(lazy(() => import('../pages/UserEditPage')));

export const HostPage = Loadable(lazy(() => import('../pages/HostPage')));
export const NewEventPage = Loadable(lazy(() => import('../pages/NewEventPage')));
export const RequestHostPage = Loadable(lazy(() => import('../pages/RequestHostPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
