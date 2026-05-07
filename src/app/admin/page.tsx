import { Building, TrendingUp, Users, Activity, MessageCircle, Plus, Edit, CheckCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/app/actions/properties";
// Helper for activity labels
const getActivityType = (prop: any) => {
  if (prop.is_sold) return { label: "Properti Terjual", icon: CheckCircle, color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
  
  const created = new Date(prop.created_at).getTime();
  const updated = new Date(prop.updated_at).getTime();
  
  // If created and updated are within 60 seconds, it's "New"
  if (Math.abs(updated - created) < 60000) {
    return { label: "Listing Baru Diterbitkan", icon: Plus, color: "text-blue-500", bgColor: "bg-blue-500/10" };
  }
  
  return { label: "Listing Diperbarui", icon: Edit, color: "text-amber-500", bgColor: "bg-amber-500/10" };
};

const formatActivityTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

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
        <Card className="lg:col-span-3 border-none shadow-sm rounded-[2rem] overflow-hidden bg-background">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-black tracking-tight">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-6">
              {[...properties]
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 5)
                .map((prop, i) => {
                  const activity = getActivityType(prop);
                  return (
                    <div key={prop.id || i} className="flex items-start">
                      <div className={`${activity.bgColor} p-3 rounded-2xl mr-4 shrink-0 border border-transparent`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-bold leading-none">{activity.label}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {prop.title}
                        </p>
                      </div>
                      <div className="ml-4 font-black text-[10px] uppercase tracking-tighter text-muted-foreground/40 shrink-0">
                        {formatActivityTime(prop.updated_at)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

<Card className="lg:col-span-4 border-none shadow-sm rounded-[2rem] overflow-hidden bg-background">
  <CardHeader className="p-6 pb-3">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-xl font-black tracking-tight">Properti Terpopuler</CardTitle>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
          Berdasarkan views & kontak WhatsApp
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full">
        <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-[11px] font-bold text-blue-600">Live</span>
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    <div className="space-y-1">
      {[...properties]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 4)
        .map((property, index) => {
          const imgUrl =
            "property_images" in property &&
            Array.isArray(property.property_images) &&
            property.property_images.length > 0
              ? property.property_images[0].image_url
              : "images" in property &&
                Array.isArray(property.images) &&
                property.images.length > 0
              ? property.images[0]
              : null;

          const views = property.views_count || 0;
          const waClicks = property.whatsapp_clicks_count || 0;
          const conversion = views > 0 ? ((waClicks / views) * 100).toFixed(1) : "0.0";

          return (
            <div
              key={property.id}
              className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              {/* Rank Badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                  index === 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : index === 1
                    ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    : index === 2
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0 overflow-hidden relative shadow-sm border border-border/10">
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

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm font-bold leading-tight truncate group-hover:text-primary transition-colors">
                  {property.title}
                </p>
                
                {/* Mobile Stats (Only visible on mobile) */}
                <div className="flex sm:hidden items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] font-bold tabular-nums">{views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    <span className="text-[11px] font-bold text-green-600 tabular-nums">{waClicks}</span>
                  </div>
                  {views > 0 && (
                    <span className="text-[10px] font-black text-primary/60">{Math.round(Number(conversion))}%</span>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground/70">
                    Rp {Number(property.price).toLocaleString("id-ID")}
                  </span>
                  <span className="text-border">·</span>
                  <span className="capitalize">{property.type}</span>
                </div>
              </div>

              {/* Stats Container (Desktop Only) */}
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                
                {/* Views Block */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold tabular-nums">
                      {views.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium mt-px uppercase tracking-tighter sm:normal-case sm:tracking-normal">views</p>
                </div>

                {/* WA Block */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center justify-end gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 fill-green-500 flex-shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[11px] sm:text-xs font-bold text-green-600 tabular-nums">
                      {waClicks.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium mt-px uppercase tracking-tighter sm:normal-case sm:tracking-normal">WA</p>
                </div>

                {/* Conversion Rate Badge */}
                {views > 0 && (
                  <div
                    className={`flex items-center justify-center w-8 sm:w-10 px-1 py-0.5 rounded-md text-[9px] font-bold flex-shrink-0 ${
                      Number(conversion) >= 5
                        ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {Math.round(Number(conversion))}%
                  </div>
                )}
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
