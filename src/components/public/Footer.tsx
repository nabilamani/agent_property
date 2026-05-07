import Link from "next/link";
import { Home, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-8 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-md">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Agent<span className="text-primary">Pro</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Bina Property Soloraya
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-lg max-w-sm mb-10 leading-relaxed font-medium">
              Platform listing properti terpercaya untuk menemukan hunian impian dengan layanan personal dari agen profesional berpengalaman.
            </p>
          </div>
          
          <div className="md:col-start-3">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-8">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-all font-bold text-sm">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-all font-bold text-sm">All Properties</Link>
              </li>
              <li>
                <Link href="/properties?type=rumah" className="text-muted-foreground hover:text-primary transition-all font-bold text-sm">Rumah</Link>
              </li>
              <li>
                <Link href="/properties?type=tanah" className="text-muted-foreground hover:text-primary transition-all font-bold text-sm">Tanah</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-8">Contact Info</h3>
            <ul className="space-y-5">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Office</span>
                <span className="text-sm font-bold text-muted-foreground leading-relaxed">
                  Jl. Mangga II No. 02/05, Palur 57745<br />Surakarta, Jawa Tengah
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Support</span>
                <span className="text-sm font-bold text-muted-foreground">soloraya@binapro.com</span>
                <span className="text-sm font-bold text-muted-foreground">+62 857 2885 3831</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AgentPro. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}