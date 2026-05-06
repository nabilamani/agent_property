import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getAgent } from "@/app/actions/agent";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const agent = await getAgent();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar agent={agent} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

