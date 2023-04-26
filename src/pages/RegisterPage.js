import { Helmet } from 'react-helmet-async';
// sections
import Register from '../sections/auth/Register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>가입하기 | HanQ</title>
      </Helmet>

      <Register />
    </>
  );
}
