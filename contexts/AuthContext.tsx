import React, {createContext, ReactNode, useContext, useState} from 'react';

interface User {
  // Define user properties here (e.g., id, name, etc.)
  id?: string;
  name?: string;
  email?: string;
}

interface IAuthContext {
  user: User | null;
  setAuth: (authUser: User | null) => void;
  setUserData: (userData: User) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState(null);

  const setAuth = (authUser: any) => {
    setUser(authUser);
  };

  const setUserData = (userData: any) => {
    setUser({...userData});
  };

  return (
    <AuthContext.Provider value={{user, setAuth, setUserData}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
