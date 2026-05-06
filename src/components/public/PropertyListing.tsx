"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/public/PropertyCard";
import { Button } from "@/components/ui/button";
import type { PropertyWithImages, PropertyType } from "@/lib/supabase/types";
import { Heart } from "lucide-react";
import { useSavedProperties } from "@/context/SavedPropertiesContext";
import Link from "next/link";

interface PropertyListingProps {
  initialProperties: PropertyWithImages[];
  agentPhone?: string;
  typeFilter?: string;
}

export function PropertyListing({ initialProperties, agentPhone, typeFilter }: PropertyListingProps) {
  const searchParams = useSearchParams();
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { savedIds } = useSavedProperties();

  // Sync with query param
  useEffect(() => {
    const isSavedParam = searchParams.get("saved") === "true";
    setShowSavedOnly(isSavedParam);
  }, [searchParams]);

  const getImages = (prop: PropertyWithImages) => {
    if (prop.property_images && Array.isArray(prop.property_images)) {
      return prop.property_images.map((img) => img.image_url);
    }
    return [];
  };

  const filteredProperties = initialProperties.filter((prop) => {
    if (showSavedOnly) {
      return savedIds.includes(prop.id);
    }
    return true;
  });

  const categories: PropertyType[] = ["Rumah", "Tanah", "Kavling", "Cluster", "Apartemen"];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 min-h-[80vh]">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Listing Properti</h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Temukan properti yang sesuai dengan kebutuhan Anda dari daftar listing kami yang terverifikasi dan berkualitas.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant={!typeFilter && !showSavedOnly ? "default" : "outline"} size="lg" className="rounded-xl h-12 px-6 font-bold" onClick={() => setShowSavedOnly(false)} asChild>
            <Link href="/properties">Semua</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                typeFilter?.toLowerCase() === category.toLowerCase() && !showSavedOnly ? "default" : "outline"
              }
              size="lg"
              className="rounded-xl h-12 px-6 font-bold"
              onClick={() => setShowSavedOnly(false)}
              asChild
            >
              <Link href={`/properties?type=${category.toLowerCase()}`}>{category}</Link>
            </Button>
          ))}
          
          <div className="w-px h-12 bg-border/50 mx-2 hidden sm:block" />

          <Button
            variant={showSavedOnly ? "default" : "outline"}
            size="lg"
            className={`rounded-xl h-12 px-6 font-bold ${showSavedOnly ? "bg-rose-500 hover:bg-rose-600 border-rose-500" : "hover:text-rose-500 hover:border-rose-200"}`}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
          >
            <Heart className={`mr-2 h-4 w-4 ${showSavedOnly ? "fill-current" : ""}`} />
            Tersimpan ({savedIds.length})
          </Button>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                price: Number(property.price),
                images: getImages(property),
              }}
              agentPhone={agentPhone}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-2xl font-black tracking-tight mb-3">
            {showSavedOnly ? "Belum ada properti tersimpan" : "Tidak ada properti ditemukan"}
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            {showSavedOnly 
              ? "Klik ikon hati pada properti yang Anda sukai untuk menyimpannya di sini." 
              : "Maaf, kami tidak menemukan properti yang sesuai dengan kriteria Anda."}
          </p>
          {showSavedOnly && (
            <Button variant="default" size="lg" className="rounded-xl h-14 px-10 font-bold" onClick={() => setShowSavedOnly(false)}>
              Lihat Semua Properti
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
