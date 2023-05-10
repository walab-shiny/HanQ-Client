import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import { NewEventForm } from '../sections/@dashboard/host';
import RoleBasedGuard from '../auth/RoleBasedGuard';

// ----------------------------------------------------------------------

export default function NewEventPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>새 이벤트 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <RoleBasedGuard hasContent roles={['host']}>
          <CustomBreadcrumbs heading="새 이벤트 등록하기" links={[]} />

          <NewEventForm />
        </RoleBasedGuard>
      </Container>
    </>
  );
}
