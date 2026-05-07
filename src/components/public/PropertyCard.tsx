"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Expand, Home, ArrowRight, Phone, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import type { Property } from "@/lib/supabase/types";
import { PropertyTracker, WhatsAppTracker } from "@/components/public/PropertyTracker";
import { WhatsAppIcon } from "@/components/icons/WhatsApp";
import { useSavedProperties } from "@/context/SavedPropertiesContext";

interface PropertyCardProps {
  property: Property & { images: string[] };
  agentPhone?: string;
}

export function PropertyCard({ property, agentPhone }: PropertyCardProps) {
  const targetPhone = agentPhone || property.agent_whatsapp || "6281234567890";
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(property.id);
  
  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 border-border/40 bg-card/50 backdrop-blur-sm">
      {/* ... (rest of the component) */}
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.id}`} className="block h-full">
          <Image
            src={property.images[0] || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-110",
              property.is_sold && "grayscale-[0.5] opacity-80"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Badges & Save Button */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            {property.is_sold ? (
              <Badge className="bg-rose-600 text-white border-none shadow-lg px-3 py-1 text-xs font-black uppercase tracking-widest animate-pulse">
                TERJUAL
              </Badge>
            ) : (
              <>
                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-none shadow-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {property.type}
                </Badge>
                {property.condition && (
                  <Badge variant="secondary" className="bg-white/90 text-primary backdrop-blur-md border-none shadow-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {property.condition}
                  </Badge>
                )}
              </>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "h-8 w-8 rounded-full backdrop-blur-md border-none shadow-sm transition-all duration-300",
              saved 
                ? "bg-rose-500 text-white hover:bg-rose-600 scale-110" 
                : "bg-white/80 dark:bg-black/40 text-foreground hover:bg-white dark:hover:bg-black/60 hover:scale-110"
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleSave(property.id);
            }}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </Button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Price & Title */}
        <div className="mb-3">
          <p className="text-primary font-black text-xl sm:text-2xl tracking-tight mb-1">
            {formatCurrency(property.price)}
          </p>
          <Link href={`/properties/${property.id}`} className="block group/title">
            <h3 className="font-bold text-base sm:text-lg line-clamp-2 leading-snug group-hover/title:text-primary transition-colors duration-300">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Address */}
        <div className="flex items-start text-muted-foreground/70 text-xs sm:text-sm gap-1.5 mb-5">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 mt-0.5 text-primary/60" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 gap-3 py-4 border-t border-border/50 mt-auto">
          {property.land_area > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-lg">
                <Expand className="h-3.5 w-3.5 text-primary/70" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold leading-none mb-1">Tanah</span>
                <span className="text-sm font-semibold">{property.land_area} m²</span>
              </div>
            </div>
          )}
          {property.building_area > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-lg">
                <Home className="h-3.5 w-3.5 text-primary/70" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold leading-none mb-1">Bangunan</span>
                <span className="text-sm font-semibold">{property.building_area} m²</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-primary/25">
            <Link href={`/properties/${property.id}`}>
              Detail
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <WhatsAppTracker id={property.id}>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="rounded-xl border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 shrink-0 shadow-sm transition-colors"
              title="Hubungi via WhatsApp"
            >
              <a
                href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(
                  `Halo AgentPro, saya tertarik dengan properti ini:\n\n🏠 *${property.title}*\n💰 *${formatCurrency(property.price)}*\n📍 ${property.address}\n\nApakah unit ini masih tersedia? Saya ingin menanyakan detail lebih lanjut. Terima kasih.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </Button>
          </WhatsAppTracker>
        </div>
      </div>
    </Card>
  );
}