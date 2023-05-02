import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../sections/@dashboard/user/UserEditForm';
import { useAuthContext } from '../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { user } = useAuthContext();
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>프로필 수정 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: user?.name },
          ]}
        />

        <UserNewEditForm isEdit currentUser={user} />
      </Container>
    </>
  );
}
