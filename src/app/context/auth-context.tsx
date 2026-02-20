import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
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

     try{
      const response = await fetch("http://localhost:8000/api/token/",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            username:email,
            password:password
          })
        });

        const data = await response.json();
        const Bearer = data.access;
        if(!response.ok){
          return false;
        }
        //Save to local Storage
        localStorage.setItem("access",data.access)
        localStorage.setItem('refresh',data.refresh)

        const profileResponse = await fetch("http://localhost:8000/api/user/profile/",
          {
            method:"GET",
            headers:{
              "Authorization":`${"Bearer " + Bearer}`,
            }
          }
        );

        if(!profileResponse.ok){
          return false;
        }
        const profileData = await profileResponse.json();
        console.log(profileData);
        const userData: User = {
          email:profileData.email,
          name:profileData.name,

        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
        
     }catch(error){
        console.log(error)
        console.error("Login failed")
        return false;
     }

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     // Mock authentication - accept any email with password "admin123"
    //     if (true) {
    //       const userData: User = {
    //         email,
    //         name: 'Admin User',
    //       };
       
        
        
    //       setUser(userData);
    //       localStorage.setItem('user', JSON.stringify(userData));
    //       resolve(true);
    //     } else {
    //       resolve(false);
    //     }
    //   }, 800); // Simulate network delay
    // });
  };

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
