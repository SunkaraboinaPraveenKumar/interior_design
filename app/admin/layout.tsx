"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/app/AuthProvider";
import { Sidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import { Menu } from "lucide-react";
import Link from "next/link";
import { PopoverContent } from "@/components/ui/popover";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuthContext();
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

  const getAvatarContent = () =>
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
  const getAvatarColor = () => {
    // Simple hash for color, or use a fixed color
    if (!user?.email) return "bg-primary text-white";
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"
    ];
    const idx = user.email.charCodeAt(0) % colors.length;
    return `${colors[idx]} text-white`;
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen lg:pl-72">

        <div className="h-16 border-b px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Avatar
                      className={`w-10 h-10 ${getAvatarColor()} flex items-center justify-center text-lg font-semibold cursor-pointer`}
                      tabIndex={0}
                    >
                      {getAvatarContent()}
                    </Avatar>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-44 p-2">
                  <div className="flex flex-col gap-2">
                    <div className="text-center font-medium mb-2">{user.name || user.email}</div>
                    {isAdmin && (
                      <Link href="/admin/dashboard">
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      onClick={signOut}
                      variant="destructive"
                      className="w-full justify-start"
                      size="sm"
                    >
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) :
              (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" className="w-full justify-start" size="sm">Sign Up</Button>
                  </Link>
                </>
              )
            }
            <ThemeToggle />
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </>
  );
}