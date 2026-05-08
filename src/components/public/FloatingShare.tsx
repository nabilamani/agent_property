"use client";

import { Share2, Link as LinkIcon, Check, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsApp";

export function FloatingShare() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const siteUrl = "https://agent-property-soloraya.vercel.app/";
  const siteTitle = "Bina Pro - Agent Properti Terpercaya";
  const shareText = "Temukan hunian impian Anda di Bina Pro! Cek daftar properti terbaik di Solo Raya di sini:";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true);
      toast.success("Link website berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon className="h-5 w-5" />,
      color: "bg-[#25D366]",
      link: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + siteUrl)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-[#1877F2]",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      name: "Copy Link",
      icon: copied ? <Check className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />,
      color: "bg-primary",
      onClick: copyToClipboard,
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-right-10 duration-500">
      {/* Share Options Tooltip-like Menu */}
      <div className={cn(
        "flex flex-col gap-2 transition-all duration-300 origin-bottom",
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      )}>
        {shareOptions.map((option) => (
          option.link ? (
            <a
              key={option.name}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95",
                option.color
              )}
            >
              {option.icon}
              <span className="whitespace-nowrap">{option.name}</span>
            </a>
          ) : (
            <button
              key={option.name}
              onClick={option.onClick}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95",
                option.color
              )}
            >
              {option.icon}
              <span className="whitespace-nowrap">{option.name}</span>
            </button>
          )
        ))}
      </div>

      {/* Main Toggle Button */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-500 relative group",
          isOpen ? "bg-rose-500 hover:bg-rose-600 rotate-[135deg]" : "bg-primary hover:bg-primary/90"
        )}
      >
        <Share2 className={cn("h-6 w-6 transition-all", isOpen ? "scale-0" : "scale-100")} />
        <X className={cn("absolute h-6 w-6 transition-all", isOpen ? "scale-100 rotate-[-135deg]" : "scale-0")} />
        
        {/* Tooltip Label */}
        {!isOpen && (
          <div className="absolute right-16 px-3 py-1 bg-background border border-border shadow-xl rounded-lg text-xs font-black uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Bagikan Website
          </div>
        )}
      </Button>
    </div>
  );
}

function Facebook({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
