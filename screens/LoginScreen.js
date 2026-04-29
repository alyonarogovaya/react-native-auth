import { useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { login as loginApi } from '../utils/auth';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { useAuth } from '../store/auth-context';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { authenticate } = useAuth();

  const login = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const authData = await loginApi(email, password);
      authenticate(authData);
    } catch (err) {
      console.error(err.message);
      Alert.alert(
        'Authentication failed',
        'Could not log you in. Please check your credentials or try again later',
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }
  return <AuthContent isLogin onAuthenticate={login} />;
}

export default LoginScreen;
