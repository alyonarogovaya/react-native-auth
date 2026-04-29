import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  authToken: '',
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  async function authenticate(authData) {
    const expirationTime = new Date(
      new Date().getTime() + authData.expiresIn * 1000,
    );

    await AsyncStorage.setItem(
      'authData',
      JSON.stringify({
        token: authData.idToken,
        refreshToken: authData.refreshToken,
        expiryDate: expirationTime.toISOString(),
      }),
    );

    setAuthToken(authData.idToken);
  }

  async function logout() {
    await AsyncStorage.removeItem('authData');
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        authenticate,
        logout,
        isAuthenticated: !!authToken,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error('AuthContext was used outside of AuthProvider');

  return context;
}

export { AuthProvider, useAuth };
