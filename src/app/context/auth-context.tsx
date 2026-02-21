import React, { createContext, useContext, useState, useEffect } from 'react';
import { makePostRequest } from '../lib/helperBearar'
import { makeGetRequest } from '../lib/helperBearar';
interface User {
  email: string;
  first_name: string;
  last_name: string;

}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call

    try {
      const data = await makePostRequest("/token/", { username: email, password: password });
      console.log("This is access token from makePostRequest")
      console.log("Tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnn:", data.data.access);
      console.log("End")
      console.log(data.status)
      if (!data.status) {
        return false;
      }
      // Save to local Storage

      localStorage.setItem("access", data.data.access)
      // console.log(data.access);
      localStorage.setItem('refresh', data.data.refresh)

      const profileResponse = await makeGetRequest("/user/profile/")

      console.log("profileResponse", profileResponse.data.email);
      console.log(!profileResponse)
      if (!profileResponse.status) {
        return false;
      }
      const userData: User = {
        email: profileResponse.data.email,
        first_name: profileResponse.data.first_name,
        last_name: profileResponse.data.last_name,

      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.log(error)
      console.error("Login failed")
      return false;
    } };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
