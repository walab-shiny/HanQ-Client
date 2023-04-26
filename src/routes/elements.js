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
export const ListPage = Loadable(lazy(() => import('../pages/ListPage')));
export const InvoiceListPage = Loadable(lazy(() => import('../pages/InvoiceListPage')));
export const HostPage = Loadable(lazy(() => import('../pages/HostPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
