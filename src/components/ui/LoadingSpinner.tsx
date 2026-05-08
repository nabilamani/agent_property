import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ fullPage = false }: { fullPage?: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-6 p-10 transition-all duration-1000",
      fullPage ? "fixed inset-0 z-[100] bg-background/80 backdrop-blur-md" : "min-h-[400px]"
    )}>
      <div className="relative scale-110 sm:scale-125">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
        
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-primary/10 rounded-3xl animate-[spin_4s_linear_infinite]" />
        
        {/* House Container */}
        <div className="relative bg-card p-6 rounded-3xl border-2 border-primary/10 shadow-2xl animate-in zoom-in duration-700">
          <div className="relative">
            <Home className="h-12 w-12 text-primary animate-[bounce_2s_ease-in-out_infinite]" />
            {/* Small door pulse */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-primary/20 rounded-t-sm animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
        </div>
        <h3 className="text-2xl font-black tracking-tighter text-foreground">
          Bina<span className="text-primary">Pro</span>
        </h3>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
          Menyiapkan Listing Terbaik
        </p>
      </div>
    </div>
  );
}
