// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@workos-inc/authkit-nextjs";

interface AuthContextType {
  user: User | null;
  accessToken?: string;
  getAccessToken: () => Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  getAccessToken: async () => undefined,
  isAuthenticated: false,
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({
  user,
  accessToken,
  children,
}: {
  user: User | null;
  accessToken?: string;
  children: ReactNode;
}) {
  const signIn = () => {
    window.location.href = "/login";
  };

  const signOut = () => {
    window.location.href = "/logout";
  };

  const getAccessToken = async () => accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        getAccessToken,
        isAuthenticated: !!user,
        isLoading: false,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}