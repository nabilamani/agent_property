import { PropertyCard } from "@/components/public/PropertyCard";
import { getProperties } from "@/app/actions/properties";
import type { PropertyType } from "@/lib/supabase/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const typeFilter = typeof params.type === "string" ? params.type : undefined;

  const properties = await getProperties({
    type: typeFilter ? (typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)) : undefined,
  });

  const getImages = (prop: (typeof properties)[0]) => {
    if ("property_images" in prop && Array.isArray(prop.property_images)) {
      return prop.property_images.map((img: { image_url: string }) => img.image_url);
    }
    return [];
  };

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
          <Button variant={!typeFilter ? "default" : "outline"} size="lg" className="rounded-xl h-12 px-6 font-bold" asChild>
            <Link href="/properties">Semua</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                typeFilter?.toLowerCase() === category.toLowerCase() ? "default" : "outline"
              }
              size="lg"
              className="rounded-xl h-12 px-6 font-bold"
              asChild
            >
              <Link href={`/properties?type=${category.toLowerCase()}`}>{category}</Link>
            </Button>
          ))}
        </div>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                price: Number(property.price),
                images: getImages(property),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
          <h3 className="text-2xl font-black tracking-tight mb-3">Tidak ada properti ditemukan</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Maaf, kami tidak menemukan properti yang sesuai dengan kriteria Anda. Coba ubah filter kategori atau reset pencarian.
          </p>
          <Button variant="default" size="lg" className="rounded-xl h-14 px-10 font-bold" asChild>
            <Link href="/properties">Lihat Semua Properti</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
