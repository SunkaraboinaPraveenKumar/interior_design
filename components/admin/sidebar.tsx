"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/lib/store";
import { useAuthContext } from "@/app/AuthProvider";
import { LayoutDashboard, GridIcon, Settings, LogOut, Menu, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { signOut, user } = useAuthContext();

  const routes = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: <GridIcon className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
          <SidebarContent 
            routes={routes} 
            pathname={pathname} 
            isActive={isActive} 
            signOut={signOut} 
            user={user ?? undefined}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 z-30 flex-col border-r bg-background w-72 transition-all duration-300">
        <SidebarContent 
          routes={routes} 
          pathname={pathname} 
          isActive={isActive} 
          signOut={signOut} 
          user={user ?? undefined}
        />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  routes: { name: string; href: string; icon: React.ReactNode }[];
  pathname: string;
  isActive: (path: string) => boolean;
  signOut: () => void;
  user?: { name?: string; email?: string };
}

function SidebarContent({ routes, pathname, isActive, signOut, user }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className="h-20 flex items-center gap-3 px-6 border-b bg-muted/50">
        <Avatar className="w-10 h-10">
          <User className="w-6 h-6 text-muted-foreground" />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-base truncate">{user?.name || "Admin User"}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email || "admin@example.com"}</span>
        </div>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                isActive(route.href)
                  ? "bg-primary/90 text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className={cn("transition-colors", isActive(route.href) ? "text-white" : "text-muted-foreground group-hover:text-foreground")}>{route.icon}</span>
              {route.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t bg-muted/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}