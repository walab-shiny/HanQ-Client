// auth
import { GoogleLogin } from '@react-oauth/google';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AuthWithGoogle() {
  const { loginWithCredential } = useAuthContext();

  const handleGoogleLogin = async (credential) => {
    try {
      if (loginWithCredential) {
        loginWithCredential(credential);
      }
      console.log('GOOGLE LOGIN');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
      onError={() => {
        console.error('Login Failed');
      }}
      useOneTap
    />
  );
}
