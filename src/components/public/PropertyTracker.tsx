"use client";

import { useEffect, useRef } from "react";
import { incrementView, incrementWhatsAppClick } from "@/app/actions/properties";

export function PropertyTracker({ id }: { id: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      incrementView(id);
      hasTracked.current = true;
    }
  }, [id]);

  return null;
}

export function WhatsAppTracker({ id, children }: { id: string, children: React.ReactNode }) {
  const handleClick = () => {
    incrementWhatsAppClick(id);
  };

  return (
    <div onClick={handleClick} className="contents cursor-pointer">
      {children}
    </div>
  );
}
