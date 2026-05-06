import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Expand, Home, ArrowLeft, Phone, Share2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatCurrency } from "@/lib/utils";
import { getPropertyById } from "@/app/actions/properties";
import { getAgent } from "@/app/actions/agent";
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await getPropertyById(id);
  const realAgent = await getAgent();

  if (!property) notFound();

  const images = property.property_images?.map((img: { image_url: string }) => img.image_url) || [];
  const agent = realAgent || {
    name: "Agent",
    phone: "6281234567890",
    photo: null,
  };

  if (!property) notFound();

  const agentName = agent?.name || "Agent";
  const agentPhone = agent?.phone || "6281234567890";
  const agentPhoto = agent?.photo || null;

  const defaultMessage = `Halo ${agentName}, saya tertarik dengan properti "${property.title}" yang diiklankan. Boleh minta info lebih lanjut?`;
  const whatsappUrl = `https://wa.me/${agentPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Listing
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Bagikan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Images & Info) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-muted rounded-xl overflow-hidden">
            {images.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img: string, idx: number) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/3] w-full md:aspect-[16/9]">
                        <Image
                          src={img}
                          alt={`${property.title} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : images.length === 1 ? (
              <div className="relative aspect-[4/3] w-full md:aspect-[16/9]">
                <Image
                  src={images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[16/9] flex items-center justify-center bg-muted text-muted-foreground">
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* Property Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-primary text-primary-foreground">{property.type}</Badge>
              <Badge variant="outline">Kondisi: {property.condition}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {property.title}
            </h1>
            <p className="text-primary text-3xl font-bold mb-4">
              {formatCurrency(Number(property.price))}
            </p>
            <div className="flex items-center text-muted-foreground text-lg mb-6">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              {property.address}
            </div>
          </div>

          {/* Property Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {property.land_area > 0 && (
              <div className="bg-card/50 backdrop-blur-sm border border-border/40 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <div className="p-2 bg-primary/5 rounded-xl mb-3">
                  <Expand className="h-6 w-6 text-primary/70" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-1">Luas Tanah</span>
                <span className="text-lg font-black tracking-tight">{property.land_area} m²</span>
              </div>
            )}
            {property.building_area > 0 && (
              <div className="bg-card/50 backdrop-blur-sm border border-border/40 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <div className="p-2 bg-primary/5 rounded-xl mb-3">
                  <Home className="h-6 w-6 text-primary/70" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-1">Luas Bangunan</span>
                <span className="text-lg font-black tracking-tight">{property.building_area} m²</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Deskripsi Properti</h2>
            <div className="prose prose-zinc max-w-none text-muted-foreground">
              {(property.description || "").split("\n").map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Map */}
          {property.map_url ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Lokasi</h2>
              <div className="w-full aspect-video rounded-xl overflow-hidden border">
                <iframe
                  src={property.map_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Lokasi</h2>
              <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center border">
                <div className="flex items-center justify-center flex-col">
                  <MapPin className="h-10 w-10 text-primary/40 mb-2" />
                  <span className="text-muted-foreground font-medium text-sm">
                    {property.address}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (Agent Info & Contact) */}
        <div>
          <div className="sticky top-24">
            <div className="bg-card/80 backdrop-blur-xl border border-primary/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-black tracking-tight mb-6">Hubungi Agen</h3>

              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-inner">
                  {agentPhoto ? (
                    <Image
                      src={agentPhoto}
                      alt={agentName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-2xl font-black text-primary/40">
                      {agentName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-black text-xl tracking-tight leading-tight mb-1">{agentName}</p>
                  <p className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1 uppercase tracking-wider">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Verified Expert
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    Chat WhatsApp
                  </a>
                </Button>
                {property.owner_whatsapp && (
                  <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl text-base font-semibold border-border/50" asChild>
                    <a
                      href={`https://wa.me/${property.owner_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Hubungi Pemilik
                    </a>
                  </Button>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50 text-sm text-center text-muted-foreground/60 italic leading-relaxed">
                <p>
                  &quot;Kepuasan Anda adalah prioritas kami. Hubungi kapan saja untuk konsultasi gratis.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
