import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
import { useAuthContext } from '../auth/useAuthContext';
import HostRequestForm from '../sections/@dashboard/host/HostRequestForm';

// ----------------------------------------------------------------------

export default function RequestHostPage() {
  const { user, reloadUser } = useAuthContext();
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>이벤트 주최 권한 신청 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="이벤트 주최 권한 신청" links={[]} />

        <HostRequestForm currentUser={user} reloadUser={reloadUser} />
      </Container>
    </>
  );
}
