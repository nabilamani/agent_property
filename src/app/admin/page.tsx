import { Building, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/app/actions/properties";
export default async function AdminDashboard() {
  const properties = await getProperties({ activeOnly: false });
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p: { is_active?: boolean }) => p.is_active).length;

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
      value: "1,240",
      icon: Users,
      description: "+18% dari bulan lalu",
    },
    {
      title: "Prospek (WhatsApp)",
      value: "45",
      icon: TrendingUp,
      description: "+12% dari bulan lalu",
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {properties.slice(0, 3).map((prop, i) => (
                <div key={prop.id || i} className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">Listing properti diperbarui</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {prop.title}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground shrink-0">
                    Baru saja
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Properti Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {properties.slice(0, 3).map((property, idx) => {
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
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden relative">
                      {imgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgUrl}
                          alt={property.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {property.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{120 - idx * 20} views</p>
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
