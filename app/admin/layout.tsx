"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/app/AuthProvider";
import { Sidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();
  const { setSidebarOpen } = useUIStore();

  useEffect(() => {
    // If the user is done loading and is not an admin, redirect to login
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, loading, isAdmin, router]);

  // Show loading state or nothing while checking authentication
  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen lg:pl-72">

        <div className="h-16 border-b px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </>
  );
}