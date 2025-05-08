import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "user";
};

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const createUser = useMutation(api.users.createUser);
  const login = useMutation(api.users.login);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const session = useQuery(
    api.auth.getSession,
    token ? { tokenIdentifier: token } : "skip"
  );

  useEffect(() => {
    if (session === null) {
      setLoading(false);
      setUser(null);
    } else if (session) {
      setUser(session.user);
      setLoading(false);
    }
  }, [session]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const user = await login({ email, password });
        if (!user) return false;
        localStorage.setItem("token", user.tokenIdentifier);
        setToken(user.tokenIdentifier);
        router.push(user.role === "admin" ? "/admin/dashboard" : "/projects");
        return true;
      } finally {
        setLoading(false);
      }
    },
    [router, login]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const tokenIdentifier = `${email}-${Date.now()}`;
        await createUser({ name, email, password, tokenIdentifier });
        localStorage.setItem("token", tokenIdentifier);
        setToken(tokenIdentifier);
        router.push("/projects");
        return true;
      } finally {
        setLoading(false);
      }
    },
    [router, createUser]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/");
  }, [router]);

  return {
    user,
    loading,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}