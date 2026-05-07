"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export function Header({ agent }: { agent: any }) {
  const displayAgent = agent || { name: "Agent", photo: null };

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden hover:bg-muted/50 rounded-xl transition-colors">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0 border-none">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-2 h-4 w-4 text-muted-foreground/50"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-10 w-full border-none bg-transparent py-0 pl-7 pr-0 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 sm:text-sm font-black"
            placeholder="Ketik untuk mencari..."
            type="search"
            name="search"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-muted/50 rounded-xl transition-all hover:scale-110">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-8 lg:w-px lg:bg-border/40" aria-hidden="true" />

          {/* Profile area */}
          <div className="flex items-center">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-muted/50 transition-all group cursor-pointer">
              <div className="h-9 w-9 relative rounded-xl overflow-hidden bg-primary/10 shadow-sm border border-primary/10 group-hover:shadow-md transition-all">
                {displayAgent.photo ? (
                  <Image
                    className="object-cover"
                    src={displayAgent.photo}
                    alt={displayAgent.name}
                    fill
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-black text-primary">
                    {displayAgent.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-black leading-tight text-foreground" aria-hidden="true">
                  {displayAgent.name}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-tight">
                  Agent Official
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
