import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import { useAuthContext } from '../auth/useAuthContext';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import UserEditForm from '../sections/@dashboard/user/UserEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { user, reloadUser } = useAuthContext();
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>프로필 수정 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="프로필 설정" links={[]} />

        <UserEditForm user={user} reloadUser={reloadUser} />
      </Container>
    </>
  );
}
