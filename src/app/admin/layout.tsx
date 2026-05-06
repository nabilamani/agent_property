import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { getAgent } from "@/app/actions/agent";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const agent = await getAgent();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header agent={agent} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

