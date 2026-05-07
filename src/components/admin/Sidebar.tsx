"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building, UserCircle, LogOut, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Properti", href: "/admin/properties", icon: Building },
  { name: "Profil Agent", href: "/admin/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-sidebar border-sidebar-border shadow-sm">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Building className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">
            Agent<span className="text-primary">Pro</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground/60"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-2xl h-12 text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
          asChild
        >
          <Link href="/">
            <Globe className="mr-3 h-5 w-5 text-primary/60" />
            Lihat Website
          </Link>
        </Button>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start rounded-2xl h-12 text-sm font-black text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
