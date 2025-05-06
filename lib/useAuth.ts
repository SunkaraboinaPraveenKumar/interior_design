import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "convex/react";
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
      try {
        setLoading(true);
        // In a real app, you would authenticate with a proper auth provider
        // This is just a mock for the demo
        const mockToken = "user-123";
        const isAdmin = email.includes("admin@");
        setUser({
          id: mockToken,
          name: email.split("@")[0],
          email,
          role: isAdmin ? "admin" : "user",
        });
        localStorage.setItem("token", mockToken);
        setToken(mockToken);
        router.push(isAdmin ? "/admin/dashboard" : "/projects");
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setLoading(true);
        // In a real app, you would register with a proper auth provider
        // This is just a mock for the demo
        const mockToken = "user-123";
        const isAdmin = email.includes("admin@");
        setUser({
          id: mockToken,
          name,
          email,
          role: isAdmin ? "admin" : "user",
        });
        localStorage.setItem("token", mockToken);
        setToken(mockToken);
        router.push(isAdmin ? "/admin/dashboard" : "/projects");
        return true;
      } catch (error) {
        console.error("Registration error:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
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