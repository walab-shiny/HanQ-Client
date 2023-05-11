import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../sections/@dashboard/user/UserEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>프로필 수정 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="프로필 설정" links={[]} />

        <UserNewEditForm isEdit />
      </Container>
    </>
  );
}
