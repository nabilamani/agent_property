"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PropertyCard } from "@/components/public/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PropertyWithImages, PropertyType } from "@/lib/supabase/types";
import { Heart, Search, SlidersHorizontal, Plus, Sparkles, Building2 } from "lucide-react";
import { useSavedProperties } from "@/context/SavedPropertiesContext";
import Link from "next/link";
import { CategoryItem, CATEGORY_ICONS } from "@/components/public/CategoryIcon";
import { cn } from "@/lib/utils";

interface PropertyListingProps {
  initialProperties: PropertyWithImages[];
  agentPhone?: string;
  typeFilter?: string;
}

export function PropertyListing({ initialProperties, agentPhone, typeFilter }: PropertyListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const categories: PropertyType[] = ["Rumah", "Tanah", "Kavling", "Cluster", "Apartemen"];

  // Optimized filtering
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((prop) => {
      // Filter by Saved
      if (showSavedOnly && !savedIds.includes(prop.id)) return false;
      
      // Filter by Type (from URL)
      if (typeFilter && prop.type.toLowerCase() !== typeFilter.toLowerCase()) return false;

      // Filter by Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          prop.title.toLowerCase().includes(query) ||
          prop.address.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [initialProperties, showSavedOnly, savedIds, typeFilter, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-4 md:py-8 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Cari lokasi, nama properti, atau area..."
                className="h-14 md:h-16 pl-12 rounded-2xl bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-base font-medium shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="icon" 
              className="h-14 w-14 md:h-16 md:w-16 rounded-2xl shadow-lg shadow-primary/20 shrink-0"
              onClick={() => {}} // Could open a more detailed filter modal later
            >
              <SlidersHorizontal className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-6 lg:px-8 py-8 md:py-12 max-w-[1600px]">
        {/* Categories Horizontal Scroll */}
        <div className="mb-10 -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-start gap-4 md:gap-8 min-w-max pb-2 md:justify-center">
            <CategoryItem 
              label="Semua"
              isActive={!typeFilter && !showSavedOnly}
              href="/properties"
              icon={<Building2 className="h-6 w-6" />}
            />
            {categories.map((cat) => (
              <CategoryItem 
                key={cat}
                label={cat}
                isActive={typeFilter?.toLowerCase() === cat.toLowerCase() && !showSavedOnly}
                href={`/properties?type=${cat.toLowerCase()}`}
                icon={CATEGORY_ICONS[cat]}
              />
            ))}
            <div className="w-px h-16 bg-border/40 self-center hidden md:block" />
            <CategoryItem 
              label={`Tersimpan (${savedIds.length})`}
              isActive={showSavedOnly}
              href="/properties?saved=true"
              icon={<Heart className={cn("h-6 w-6", showSavedOnly && "fill-current")} />}
            />
          </div>
        </div>

        {/* Promotional Banner (Mobile Style) */}
        {!typeFilter && !searchQuery && !showSavedOnly && (
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-blue-600 p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
              {/* Decorative background elements */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest mb-4">
                    <Sparkles className="h-3 w-3" />
                    Penawaran Terbatas
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                    Pasang Properti Anda <br /> Secara <span className="italic underline decoration-amber-400">Gratis</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl">
                    Dapatkan jangkauan luas dan calon pembeli berkualitas hanya di Bina Pro.
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <Button 
                    size="xl" 
                    variant="secondary" 
                    className="h-16 px-10 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform"
                    asChild
                  >
                    <a href={`https://wa.me/${agentPhone}`} target="_blank" rel="noopener noreferrer">
                      <Plus className="mr-2 h-6 w-6" />
                      Pasang Sekarang
                    </a>
                  </Button>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Tanpa Biaya Admin</p>
                </div>
              </div>

              {/* Floating house icon (mobile only visual gimmick) */}
              <div className="absolute right-10 bottom-0 opacity-20 hidden lg:block">
                <Building2 className="h-48 w-48 rotate-12" />
              </div>
            </div>
          </div>
        )}

        {/* Listing Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {showSavedOnly ? "Properti Tersimpan" : typeFilter ? `Listing ${typeFilter}` : "Semua Properti"}
            </h2>
            <p className="text-muted-foreground font-medium">Menampilkan {filteredProperties.length} unit tersedia</p>
          </div>
        </div>

        {/* Grid System */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
          <div className="text-center py-24 bg-white rounded-[3rem] border border-border/40 shadow-sm">
            <div className="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-3 text-foreground">
              {showSavedOnly ? "Belum ada yang disimpan" : "Tidak ditemukan"}
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto font-medium">
              {showSavedOnly 
                ? "Simpan properti favorit Anda dengan menekan ikon hati pada kartu properti." 
                : "Coba gunakan kata kunci lain atau ubah kategori filter Anda."}
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-xl h-14 px-10 font-bold" 
              onClick={() => {
                setSearchQuery("");
                if (showSavedOnly) setShowSavedOnly(false);
                else router.push("/properties");
              }}
            >
              Reset Semua Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
