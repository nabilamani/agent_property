"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Phone, LogIn } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
];

import { useSavedProperties } from "@/context/SavedPropertiesContext";
import { Heart } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsApp";

export function Navbar({ agent }: { agent: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const agentPhone = agent?.phone || "6281234567890";
  const { savedIds } = useSavedProperties();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {agent?.logo ? (
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl border border-border/40 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20">
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
                  Property Soloraya
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
            
            <Link 
              href="/properties?saved=true" 
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-rose-500 transition-colors border-l pl-6"
            >
              <div className="relative">
                <Heart className="h-4 w-4 group-hover:fill-current" />
                {savedIds.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                    {savedIds.length}
                  </span>
                )}
              </div>
              Saved
            </Link>

            <div className="flex items-center gap-4 ml-4 border-l pl-6">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Button asChild size="sm">
                <a href={`https://wa.me/${agentPhone}`} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-4 w-4" />
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
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none shadow-2xl bg-transparent">
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div 
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="flex flex-col h-full bg-background/95 backdrop-blur-2xl"
                    >
                      {/* Mobile Menu Header */}
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl">
                              <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                              <span className="text-xl font-bold tracking-tight">
                                Agent<span className="text-primary">Pro</span>
                              </span>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                                Property Soloraya
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Mobile Menu Links */}
                      <div className="flex-1 overflow-y-auto py-10 px-6">
                        <div className="flex flex-col gap-3">
                          {NAV_LINKS.map((link, i) => (
                            <motion.div
                              key={link.href}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.1 }}
                            >
                              <Link
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center justify-between p-5 rounded-[1.5rem] text-lg font-black transition-all duration-300 ${
                                  pathname === link.href 
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                {link.name}
                                <motion.div
                                  animate={pathname === link.href ? { x: [0, 5, 0] } : {}}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                >
                                  <Home className={`h-5 w-5 ${pathname === link.href ? "opacity-100" : "opacity-0"}`} />
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                          
                          {/* Mobile Saved Link */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + NAV_LINKS.length * 0.1 }}
                          >
                            <Link
                              href="/properties?saved=true"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-5 rounded-[1.5rem] text-lg font-black text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Heart className="h-5 w-5" />
                                  {savedIds.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                                      {savedIds.length}
                                    </span>
                                  )}
                                </div>
                                Saved Properties
                              </div>
                            </Link>
                          </motion.div>
                        </div>
                      </div>

                      {/* Mobile Menu Footer */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 mt-auto border-t border-border/50 space-y-4 bg-muted/20"
                      >
                        <Button asChild size="xl" className="w-full shadow-xl shadow-primary/20 rounded-2xl h-14 text-base font-bold">
                          <a href={`https://wa.me/${agentPhone}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon className="mr-3 h-5 w-5" />
                            Hubungi Kami
                          </a>
                        </Button>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                          <Button variant="outline" size="xl" className="w-full border-border/50 rounded-2xl h-14 text-base font-bold">
                            <LogIn className="mr-3 h-5 w-5" />
                            Login Admin
                          </Button>
                        </Link>
                        
                        <div className="pt-6 text-center">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black opacity-50">
                            &copy; 2026 AgentPro &bull; Premium Property
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
