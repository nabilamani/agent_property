"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Phone, LogIn } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
];

export function Navbar({ agent }: { agent: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const agentPhone = agent?.phone || "6281234567890";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {agent?.logo ? (
                <div className="relative h-12 w-12 bg-white rounded-xl border border-border/40 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20">
                  <Image src={agent.logo} alt="Logo" fill className="object-contain rounded-xl p-2" />
                </div>
              ) : (
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Home className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Agent<span className="text-primary">Pro</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Property Expert
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 border-l pl-6">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Button asChild size="sm">
                <a href={`https://wa.me/${agentPhone}`} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none shadow-2xl">
                <div className="flex flex-col h-full bg-background/80 backdrop-blur-2xl">
                  {/* Mobile Menu Header */}
                  <div className="p-6 border-b border-border/50">
                    <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col -space-y-1">
                        <span className="text-xl font-bold tracking-tight">
                          Agent<span className="text-primary">Pro</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                          Property Expert
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="flex-1 overflow-y-auto py-8 px-6">
                    <div className="flex flex-col gap-2">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                            pathname === link.href 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {link.name}
                          <Home className={`h-4 w-4 ${pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="p-6 mt-auto border-t border-border/50 space-y-3">
                    <Button asChild size="xl" className="w-full shadow-lg shadow-primary/20">
                      <a href={`https://wa.me/${agentPhone}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-2.5 h-5 w-5" />
                        Hubungi Kami
                      </a>
                    </Button>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" size="xl" className="w-full border-border/50">
                        <LogIn className="mr-2.5 h-5 w-5" />
                        Login Admin
                      </Button>
                    </Link>
                    
                    <div className="pt-4 text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                        &copy; 2026 AgentPro Property
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
