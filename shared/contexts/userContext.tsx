"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";

interface UserContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("🔥 UserContext: Initializing auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 UserContext: Auth state changed", {
        hasUser: !!user,
        uid: user?.uid,
        email: user?.email,
      });

      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        console.log("✅ UserContext: User logged in", user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log("❌ UserContext: User logged out", user);
      }
      setLoading(false);
      console.log("🔥 UserContext: State updated", {
        isAuthenticated: !!user,
        loading: false,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("🔥 UserContext: Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  const contextValue: UserContextProps = {
    isAuthenticated,
    user,
    loading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export const UserContextConsumer = UserContext.Consumer;
