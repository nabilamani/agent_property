"use client";

import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareData = {
      title,
      text: text || `Cek properti menarik ini: ${title}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Berhasil dibagikan!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success("Link berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Gagal menyalin link:", err);
      toast.error("Gagal menyalin link");
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleShare}
      className="rounded-xl font-bold transition-all hover:bg-primary/5 hover:text-primary active:scale-95"
    >
      {copied ? (
        <Check className="mr-2 h-4 w-4 text-emerald-500" />
      ) : (
        <Share2 className="mr-2 h-4 w-4" />
      )}
      {copied ? "Tersalin" : "Bagikan"}
    </Button>
  );
}
