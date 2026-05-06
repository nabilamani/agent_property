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
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="bg-primary p-1.5 rounded-md">
            <Building className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Agent<span className="text-primary">Pro</span> Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <Globe className="mr-2 h-4 w-4" />
            Lihat Website
          </Link>
        </Button>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
