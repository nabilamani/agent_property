"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/public/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PropertyWithImages } from "@/lib/supabase/types";
import { Heart, Search, SlidersHorizontal, LayoutGrid, HeartOff, SearchX } from "lucide-react";
import { useSavedProperties } from "@/context/SavedPropertiesContext";
import Link from "next/link";
import Image from "next/image";
import { CategoryIcon } from "@/components/public/CategoryIcon";
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
  
  // Advanced Filters State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [condition, setCondition] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

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

  const resetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setCondition("all");
    setStatus("all");
    setShowSavedOnly(false);
    setIsFilterOpen(false);
    router.push("/properties");
  };

  // Efficient local filtering
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((prop) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        prop.title.toLowerCase().includes(query) ||
        prop.address.toLowerCase().includes(query) ||
        prop.type.toLowerCase().includes(query);
      
      const matchesSaved = showSavedOnly ? savedIds.includes(prop.id) : true;
      
      const matchesType = typeFilter 
        ? prop.type.toLowerCase() === typeFilter.toLowerCase() 
        : true;

      const price = Number(prop.price);
      const matchesMinPrice = minPrice ? price >= Number(minPrice) : true;
      const matchesMaxPrice = maxPrice ? price <= Number(maxPrice) : true;
      
      const matchesCondition = condition === "all" 
        ? true 
        : prop.condition?.toLowerCase() === condition.toLowerCase();
      
      const matchesStatus = status === "all" 
        ? true 
        : status === "sold" ? !!prop.is_sold : !prop.is_sold;
      
      return matchesSearch && matchesSaved && matchesType && matchesMinPrice && matchesMaxPrice && matchesCondition && matchesStatus;
    });
  }, [initialProperties, searchQuery, showSavedOnly, savedIds, typeFilter, minPrice, maxPrice, condition, status]);

  const categories = [
    { name: "Semua", id: "all", href: "/properties" },
    { name: "Rumah", id: "rumah", href: "/properties?type=rumah" },
    { name: "Tanah", id: "tanah", href: "/properties?type=tanah" },
    { name: "Kavling", id: "kavling", href: "/properties?type=kavling" },
    { name: "Cluster", id: "cluster", href: "/properties?type=cluster" },
    { name: "Apartemen", id: "apartemen", href: "/properties?type=apartemen" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 min-h-[80vh]">
      
      {/* Search Header */}
      <div className="flex gap-3 mb-3 sm:mb-5 sticky top-4 z-30 bg-background/80 backdrop-blur-xl p-2 -mx-2 rounded-2xl sm:relative sm:top-0 sm:bg-transparent sm:p-0 sm:mx-0 transition-all duration-300">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari lokasi, nama properti, atau area..." 
            className="pl-12 h-14 rounded-2xl border-none bg-card shadow-sm focus-visible:ring-primary/20 text-base font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger
            render={
              <Button size="icon" className={cn(
                "h-14 w-14 rounded-2xl shadow-lg transition-all shrink-0",
                (minPrice || maxPrice || condition !== "all" || status !== "all") 
                  ? "bg-primary text-primary-foreground shadow-primary/30" 
                  : "bg-card text-foreground hover:bg-muted"
              )}>
                <SlidersHorizontal className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-full sm:max-w-md bg-card border-l-border/50 p-0 flex flex-col">
            <div className="p-8 pb-4">
              <SheetHeader>
                <SheetTitle className="text-2xl font-black uppercase tracking-tight">Filter Properti</SheetTitle>
                <SheetDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sesuaikan pencarian Anda</SheetDescription>
              </SheetHeader>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">
              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">Rentang Harga (Rp)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Min</span>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-12 rounded-xl bg-muted/30 border-none" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Max</span>
                    <Input 
                      type="number" 
                      placeholder="Miliar" 
                      className="h-12 rounded-xl bg-muted/30 border-none" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">Kondisi Properti</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["all", "baru", "bekas"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={cn(
                        "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                        condition === c 
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {c === "all" ? "Semua" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Tersedia", value: "available" },
                    { label: "Terjual", value: "sold" },
                    { label: "Semua", value: "all" }
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStatus(s.value)}
                      className={cn(
                        "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                        status === s.value 
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 pt-4 border-t border-border/50 bg-muted/10 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-xs" onClick={resetFilters}>
                Reset
              </Button>
              <SheetTrigger
                render={
                  <Button 
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                  >
                    Terapkan
                  </Button>
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Icons Navigation */}
      <div className="flex overflow-x-auto pt-2 gap-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:justify-center transition-all duration-500">
        <div className="flex items-center gap-6 sm:gap-8">
          {categories.map((cat) => {
            const isActive = (!typeFilter && cat.id === "all" && !showSavedOnly) || 
                            (typeFilter?.toLowerCase() === cat.id && !showSavedOnly);
            return (
              <Link 
                key={cat.id} 
                href={cat.href}
                onClick={() => {
                  setShowSavedOnly(false);
                  setSearchQuery("");
                }}
                className="flex flex-col items-center gap-3 shrink-0 group transition-all"
              >
                <div className={cn(
                  "h-14 w-14 sm:h-18 sm:w-18 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110" 
                    : "bg-card border-transparent text-muted-foreground group-hover:border-primary/30 group-hover:text-primary group-hover:scale-105"
                )}>
                  <CategoryIcon name={cat.name} className="h-6 w-6 sm:h-7 sm:h-7" />
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}>
                  {cat.name}
                </span>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="w-0.5 h-10 bg-border/80 self-center shrink-0 mx-2" />

          {/* Saved Items Toggle */}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="flex flex-col items-center gap-3 shrink-0 group transition-all"
          >
            <div className={cn(
              "h-14 w-14 sm:h-18 sm:w-18 rounded-full flex items-center justify-center transition-all duration-300 border-2",
              showSavedOnly 
                ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-200 scale-110" 
                : "bg-card border-transparent text-muted-foreground group-hover:border-rose-200 group-hover:text-rose-500 group-hover:scale-105"
            )}>
              <Heart className={cn("h-6 w-6 sm:h-7 sm:w-7", showSavedOnly && "fill-current")} />
            </div>
            <span className={cn(
              "text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors",
              showSavedOnly ? "text-rose-500" : "text-muted-foreground group-hover:text-rose-500"
            )}>
              Tersimpan ({savedIds.length})
            </span>
          </button>
        </div>
      </div>

      {/* Ultra-Compact Promotional Banner */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 md:p-7 mb-8 group shadow-lg shadow-primary/10 border border-white/5 transition-all hover:shadow-primary/20">
        <div className="relative z-10 flex flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-base md:text-3xl font-black tracking-tight leading-tight">
              Pasang Properti <span className="italic font-serif">Gratis</span>
            </h2>
            <p className="hidden md:block text-primary-foreground/80 text-sm font-medium opacity-80 mt-1">
              Jangkau lebih banyak pembeli berkualitas hanya di Bina Pro.
            </p>
            <p className="md:hidden text-[9px] font-bold uppercase tracking-widest text-white/60">Tanpa Biaya Admin</p>
          </div>
          
          <Button variant="secondary" size="sm" asChild className="rounded-xl px-5 h-10 md:h-12 font-black shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-[10px] md:text-sm shrink-0 bg-white text-primary hover:bg-white/90">
            <Link href={`https://wa.me/${agentPhone}`} target="_blank">
              Pasang Sekarang
            </Link>
          </Button>
        </div>
        
        {/* Subtle Decorative elements */}
        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <LayoutGrid className="h-24 w-24 md:h-32 md:w-32 rotate-12" />
        </div>
      </div>

      {/* Listing Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-black tracking-tight uppercase mb-1">Semua Properti</h3>
          <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.3em]">Menampilkan {filteredProperties.length} unit tersedia</p>
        </div>
        <div className="h-px flex-1 bg-border/40 mx-8 hidden sm:block" />
      </div>

      {/* Property Grid */}
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
        /* Empty State */
        <div className="text-center py-40 bg-card rounded-[3rem] border border-border/50 shadow-sm animate-in fade-in zoom-in duration-500">
          <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-8 border-4 border-background shadow-inner">
            {showSavedOnly ? (
              <HeartOff className="h-10 w-10 text-muted-foreground/20" />
            ) : (
              <SearchX className="h-10 w-10 text-muted-foreground/20" />
            )}
          </div>
          <h3 className="text-4xl font-black tracking-tight mb-4 uppercase">
            {showSavedOnly ? "Belum ada tersimpan" : "Tidak ditemukan"}
          </h3>
          <p className="text-muted-foreground text-lg mb-12 max-w-sm mx-auto font-medium leading-relaxed">
            {showSavedOnly 
              ? "Klik ikon hati pada properti yang Anda sukai untuk menyimpannya di sini." 
              : "Coba gunakan kriteria pencarian lain atau tekan tombol di bawah untuk reset."}
          </p>
          <Button variant="outline" size="lg" className="rounded-2xl h-16 px-12 font-black border-2 transition-all hover:bg-primary hover:text-white hover:border-primary text-lg" onClick={resetFilters}>
            Lihat Semua Unit
          </Button>
        </div>
      )}
    </div>
  );
}
