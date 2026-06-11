"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

export type CustomerProfile = {
  id: string;
  authUserId?: string | null;
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  cpf?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
};

type StoredAuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  customer: CustomerProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  refreshCustomer: () => Promise<CustomerProfile | null>;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext({} as AuthContextType);
const authStorageKey = "@shirtclub:auth";

const getStoredSession = () => {
  if (typeof window === "undefined") return null;

  const rawSession = localStorage.getItem(authStorageKey);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as StoredAuthSession;
  } catch {
    localStorage.removeItem(authStorageKey);
    return null;
  }
};

export const saveAuthSession = (session: StoredAuthSession) => {
  localStorage.setItem(authStorageKey, JSON.stringify(session));
};

export const clearAuthSession = () => {
  localStorage.removeItem(authStorageKey);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<StoredAuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const accessToken = session?.accessToken || null;

  const authFetch = useCallback(
    (input: RequestInfo | URL, init: RequestInit = {}) => {
      return fetch(input, {
        ...init,
        headers: {
          ...(init.headers || {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
    },
    [accessToken]
  );

  const refreshCustomer = useCallback(async () => {
    if (!accessToken) return null;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    const response = await authFetch("/api/customer/me", {
      signal: controller.signal,
    }).finally(() => window.clearTimeout(timeout));

    if (!response.ok) {
      clearAuthSession();
      setSession(null);
      setUser(null);
      setCustomer(null);
      return null;
    }

    const data = (await response.json()) as {
      user: AuthUser;
      customer: CustomerProfile;
    };

    setUser(data.user);
    setCustomer(data.customer);

    return data.customer;
  }, [accessToken, authFetch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedSession = getStoredSession();

      if (storedSession?.accessToken) {
        setSession(storedSession);
        return;
      }

      setIsLoading(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let shouldIgnore = false;

    const loadCustomer = async () => {
      setIsLoading(true);

      try {
        await refreshCustomer();
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      } catch {
        if (!shouldIgnore) {
          clearAuthSession();
          setSession(null);
          setUser(null);
          setCustomer(null);
          setIsLoading(false);
        }
      }
    };

    void loadCustomer();

    return () => {
      shouldIgnore = true;
    };
  }, [accessToken, refreshCustomer]);

  const loginWithGoogle = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      toast.error("Configure NEXT_PUBLIC_SUPABASE_URL para usar login");
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const loginUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
    loginUrl.searchParams.set("provider", "google");
    loginUrl.searchParams.set("redirect_to", redirectTo);
    loginUrl.searchParams.set("flow_type", "implicit");
    loginUrl.searchParams.set("prompt", "select_account");

    window.location.assign(loginUrl.toString());
  };

  const logout = () => {
    clearAuthSession();
    setSession(null);
    setUser(null);
    setCustomer(null);
    toast.info("Você saiu da sua conta");
  };

  const value = useMemo(
    () => ({
      user,
      customer,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(accessToken && user),
      loginWithGoogle,
      logout,
      refreshCustomer,
      authFetch,
    }),
    [accessToken, authFetch, customer, isLoading, refreshCustomer, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
