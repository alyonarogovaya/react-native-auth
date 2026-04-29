import { useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../utils/auth';
import { Alert } from 'react-native';
import { useAuth } from '../store/auth-context';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { authenticate } = useAuth();

  const signup = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const authData = await createUser(email, password);
      authenticate(authData);
    } catch (err) {
      console.error(err.message);
      Alert.alert(
        'Authentication failed',
        'Could not create user. Please check your credentials and try again later',
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signup} />;
}

export default SignupScreen;
