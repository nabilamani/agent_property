"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Expand, Home, ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import type { Property } from "@/lib/supabase/types";
import { WhatsAppTracker } from "@/components/public/PropertyTracker";
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
    <Card className="overflow-hidden flex flex-col h-full group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border-border/10 bg-[#121212] dark:bg-[#0D0D0D] rounded-[2.5rem]">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[2rem]">
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
        </Link>
        
        {/* Badges & Save Button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            {property.is_sold ? (
              <Badge className="bg-rose-500 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                TERJUAL
              </Badge>
            ) : (
              <>
                <Badge className="bg-[#FF7D52] text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                  {property.type}
                </Badge>
                {property.condition && (
                  <Badge className="bg-white text-black border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {property.condition}
                  </Badge>
                )}
              </>
            )}
          </div>
          <Button
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full backdrop-blur-md transition-all duration-300 border-none",
              saved 
                ? "bg-rose-500 text-white" 
                : "bg-black/30 text-white hover:bg-white hover:text-black shadow-lg"
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleSave(property.id);
            }}
          >
            <Heart className={cn("h-5 w-5", saved && "fill-current")} />
          </Button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6 pt-2">
        {/* Price & Title */}
        <div className="mb-4">
          <p className="text-[#FF7D52] font-black text-2xl tracking-tight mb-2">
            {formatCurrency(property.price)}
          </p>
          <Link href={`/properties/${property.id}`} className="block">
            <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight hover:text-primary transition-colors">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Address */}
        <div className="flex items-start text-white/40 text-sm gap-2 mb-6">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="line-clamp-1 font-medium">{property.address}</span>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {property.land_area > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                <Expand className="h-5 w-5 text-[#FF7D52]" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-black truncate">Tanah</span>
                <span className="text-sm font-bold text-white leading-none truncate">{property.land_area} m²</span>
              </div>
            </div>
          )}
          {property.building_area > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                <Home className="h-5 w-5 text-[#FF7D52]" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-black truncate">Bangunan</span>
                <span className="text-sm font-bold text-white leading-none truncate">{property.building_area} m²</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <Button asChild className="flex-1 h-14 rounded-2xl bg-[#FF7D52] hover:bg-[#FF7D52]/90 text-white font-black text-base shadow-xl shadow-[#FF7D52]/20 border-none">
            <Link href={`/properties/${property.id}`}>
              Detail
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <WhatsAppTracker id={property.id}>
            <a
              href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(
                `Halo Bina Pro, saya tertarik dengan properti ini:\n\n🏠 *${property.title}*\n💰 *${formatCurrency(property.price)}*\n📍 ${property.address}\n\n🔗 *Link Detail:* https://agent-property-soloraya.vercel.app/properties/${property.id}\n\nApakah unit ini masih tersedia? Terima kasih.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 w-14 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10 shrink-0"
              title="Hubungi via WhatsApp"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </WhatsAppTracker>
        </div>
      </div>
    </Card>
  );
}