import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/public/PropertyCard";
import { getProperties } from "@/app/actions/properties";
import { getAgent } from "@/app/actions/agent";
export default async function LandingPage() {
  const properties = await getProperties();
  const agent = await getAgent();

  const displayProperties = properties || [];
  const displayAgent = agent || {
    name: "Agent",
    phone: "6281234567890",
    bio: "",
    photo: null,
    logo: null,
    caption: "",
  };

  const featuredProperties = displayProperties.slice(0, 3);

  // Helper to get images array
  const getImages = (prop: (typeof displayProperties)[0]) => {
    if ("property_images" in prop && Array.isArray(prop.property_images)) {
      return prop.property_images.map((img: { image_url: string }) => img.image_url);
    }
    if ("images" in prop && Array.isArray(prop.images)) {
      return prop.images;
    }
    return [];
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/bg-hero.webp"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Agent Properti Terpercaya & Profesional
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              Temukan Hunian <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white text-white">Impian Anda</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Eksplorasi pilihan rumah, apartemen, dan tanah terbaik di lokasi paling strategis. 
              Mulai perjalanan investasi masa depan Anda hari ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Button size="lg" asChild className="text-lg h-16 px-10 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90">
                <Link href="/properties">
                  <Search className="mr-3 h-6 w-6" />
                  Cari Properti
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-16 px-10 rounded-2xl backdrop-blur-md bg-white/5 border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                <a
                  href={`https://wa.me/${displayAgent.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  Hubungi Agen
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Properti Pilihan</h2>
              <p className="text-muted-foreground">
                Listing terbaik dan paling dicari saat ini.
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/properties">
                Lihat Semua Listing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  price: Number(property.price),
                  images: getImages(property),
                }}
                agentPhone={displayAgent.phone}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center md:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/properties">
                Lihat Semua Listing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Agent Branding Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="relative w-56 h-56 md:w-72 md:h-72 shrink-0 group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-500" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {displayAgent.photo ? (
                  <Image
                    src={displayAgent.photo}
                    alt={displayAgent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-7xl font-bold">
                    {displayAgent.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Verified Property Soloraya
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {displayAgent.caption || "Bersama Membangun Impian Properti Anda"}
              </h2>
              
              <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed italic">
                &quot;{displayAgent.bio || "Agent properti profesional yang siap membantu Anda menemukan rumah impian dengan layanan personal dan transparan."}&quot;
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-none mb-1">{displayAgent.name}</p>
                    <p className="text-white/60 text-sm">Professional Agent</p>
                  </div>
                </div>
                
                {displayAgent.logo && (
                  <div className="relative h-16 w-16 bg-white rounded-2xl shadow-2xl p-2 group hover:scale-110 transition-transform duration-300 sm:ml-auto">
                    <Image
                      src={displayAgent.logo}
                      alt="Property Logo"
                      fill
                      className="object-contain rounded-xl p-2"
                    />
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-center md:justify-start">
                <Button variant="secondary" size="lg" asChild className="h-14 px-10 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <a
                    href={`https://wa.me/${displayAgent.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Konsultasi Gratis Sekarang
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
