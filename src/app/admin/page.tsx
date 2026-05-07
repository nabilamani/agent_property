import { Building, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/app/actions/properties";
export default async function AdminDashboard() {
  const properties = await getProperties({ activeOnly: false });
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p: { is_active?: boolean }) => p.is_active).length;

  const totalViews = properties.reduce((acc, p) => acc + (p.views_count || 0), 0);
  const totalWhatsAppClicks = properties.reduce((acc, p) => acc + (p.whatsapp_clicks_count || 0), 0);

  const stats = [
    {
      title: "Total Properti",
      value: totalProperties.toString(),
      icon: Building,
      description: "Total listing dalam sistem",
    },
    {
      title: "Properti Aktif",
      value: activeProperties.toString(),
      icon: Activity,
      description: "Listing yang dipublikasikan",
    },
    {
      title: "Total Dilihat",
      value: totalViews.toLocaleString(),
      icon: Users,
      description: "Berdasarkan kunjungan halaman",
    },
    {
      title: "Prospek (WhatsApp)",
      value: totalWhatsAppClicks.toLocaleString(),
      icon: TrendingUp,
      description: "Klik pada tombol WhatsApp",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas dan performa listing properti Anda.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3 md:px-5 md:pt-4">
              <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/70">{stat.title}</CardTitle>
              <div className={`p-1.5 rounded-lg bg-background shadow-sm ${
                i === 0 ? "text-blue-500" : 
                i === 1 ? "text-emerald-500" : 
                i === 2 ? "text-amber-500" : "text-primary"
              }`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 md:px-5 md:pb-4">
              <div className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</div>
              <p className="text-[9px] md:text-[11px] text-muted-foreground font-medium mt-0.5 leading-tight">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-sm rounded-[2rem] overflow-hidden bg-background">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-black tracking-tight">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">
              {properties.slice(0, 4).map((prop, i) => (
                <div key={prop.id || i} className="flex items-start">
                  <div className="bg-primary/5 p-3 rounded-2xl mr-4 shrink-0 border border-primary/5">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-none">Listing properti diperbarui</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {prop.title}
                    </p>
                  </div>
                  <div className="ml-4 font-black text-[10px] uppercase tracking-tighter text-muted-foreground/40 shrink-0">
                    Baru saja
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm rounded-[2rem] overflow-hidden bg-background">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-black tracking-tight">Properti Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">
              {[...properties]
                .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
                .slice(0, 4)
                .map((property) => {
                const imgUrl =
                  "property_images" in property &&
                  Array.isArray(property.property_images) &&
                  property.property_images.length > 0
                    ? property.property_images[0].image_url
                    : "images" in property && Array.isArray(property.images) && property.images.length > 0
                    ? property.images[0]
                    : null;

                return (
                  <div key={property.id} className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex-shrink-0 overflow-hidden relative shadow-sm border border-border/10">
                      {imgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgUrl}
                          alt={property.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-black">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-black leading-tight truncate">
                        {property.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <p className="text-[11px] text-emerald-600 font-black">{(property.views_count || 0).toLocaleString()} views</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
