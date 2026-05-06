import Link from "next/link";
import { Home, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Agent<span className="text-primary">Pro</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Property Expert
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              Platform listing properti terpercaya untuk menemukan hunian impian dengan layanan personal dari agen profesional berpengalaman.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <LinkIcon className="h-5 w-5" />
                <span className="sr-only">Social Link</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-primary transition-colors">All Properties</Link>
              </li>
              <li>
                <Link href="/properties?type=rumah" className="hover:text-primary transition-colors">Rumah</Link>
              </li>
              <li>
                <Link href="/properties?type=tanah" className="hover:text-primary transition-colors">Tanah</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Jl. Contoh Properti No. 123</li>
              <li>Jakarta Selatan, 12345</li>
              <li>info@agentpro.com</li>
              <li>+62 812 3456 7890</li>
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
