"use client";

import { Home, Building2, Building, Grid3X3, Palmtree, Trees, Map, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryItemProps {
  label: string;
  isActive: boolean;
  href: string;
  icon: React.ReactNode;
}

export function CategoryItem({ label, isActive, href, icon }: CategoryItemProps) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center gap-3 min-w-[80px] group transition-all"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2",
        isActive 
          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
          : "bg-white border-transparent text-muted-foreground hover:border-primary/20 hover:text-primary shadow-sm"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs font-bold tracking-tight transition-colors whitespace-nowrap",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
      )}>
        {label}
      </span>
    </Link>
  );
}

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Rumah": <Home className="h-6 w-6" />,
  "Apartemen": <Building2 className="h-6 w-6" />,
  "Cluster": <Building className="h-6 w-6" />,
  "Kavling": <Grid3X3 className="h-6 w-6" />,
  "Tanah": <Palmtree className="h-6 w-6" />,
  "Saved": <Heart className="h-6 w-6" />
};
