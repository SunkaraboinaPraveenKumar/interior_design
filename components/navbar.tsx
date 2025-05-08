"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/app/AuthProvider";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuthContext();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  // Helper for avatar content and color
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between p-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">Elegant Interiors</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive(item.href)
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
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
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40"
          >
            <div className="container py-4 flex flex-col gap-4">
              <nav className="flex flex-col gap-3 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "transition-colors hover:text-foreground/80 py-2",
                      isActive(item.href)
                        ? "text-foreground font-medium"
                        : "text-foreground/60"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <ThemeToggle />
                {user && (
                  <div className="flex justify-center py-2">
                    <Avatar className={`w-10 h-10 ${getAvatarColor()} flex items-center justify-center text-lg font-semibold`}>
                      {getAvatarContent()}
                    </Avatar>
                  </div>
                )}
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin/dashboard" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start" size="sm">Dashboard</Button>
                      </Link>
                    )}
                    <Button onClick={() => { signOut(); closeMobileMenu(); }} variant="ghost" className="w-full justify-start" size="sm">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button variant="default" className="w-full justify-start" size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}