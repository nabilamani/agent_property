"use client";

import * as React from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyImageSliderProps {
  images: string[];
  title: string;
}

export function PropertyImageSlider({ images, title }: PropertyImageSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] flex items-center justify-center bg-muted text-muted-foreground rounded-xl border">
        Tidak ada gambar
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.reset()}
      >
        <CarouselContent className="-ml-4">
          {images.map((img, idx) => (
            <CarouselItem key={idx} className="pl-4">
              <div 
                className="relative aspect-[4/3] w-full md:aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl" 
                onClick={() => setIsOpen(true)}
              >
                <Image
                  src={img}
                  alt={`${title} - Image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={idx === 0}
                />
                
                {/* Overlay gradient for better button/dot visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/30 h-10 w-10" />
            <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/30 h-10 w-10" />
            
            {/* Pagination Dots - Positioned higher inside the image */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    api?.scrollTo(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                    current === i + 1 ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Slide Counter Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 z-10 shadow-sm">
              {current} / {count}
            </div>
          </>
        )}

        {/* Expand Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-8 right-8 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-sm"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            }
          />
          <DialogContent className="max-w-[100vw] w-full p-0 border-none bg-black overflow-hidden h-[100dvh]">
            <DialogTitle className="sr-only">Galeri Foto Fullscreen</DialogTitle>
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <Carousel 
                className="w-full h-full"
                opts={{ startIndex: Math.max(0, current - 1) }}
              >
                <CarouselContent className="-ml-4">
                  {images.map((img, idx) => (
                    <CarouselItem key={idx} className="pl-4 flex items-center justify-center w-full h-[100dvh]">
                      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                        <div className="relative w-full h-full">
                          <Image
                            src={img}
                            alt={`${title} - Full Image ${idx + 1}`}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 md:left-8 text-white border-white/20 bg-white/10 hover:bg-white/20 h-12 w-12" />
                    <CarouselNext className="right-4 md:right-8 text-white border-white/20 bg-white/10 hover:bg-white/20 h-12 w-12" />
                  </>
                )}
              </Carousel>
              
              {/* Close Button UI */}
              <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10 rounded-full h-12 w-12 bg-black/20 backdrop-blur-md border border-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Bottom Info Bar for Fullscreen */}
              <div className="absolute bottom-6 left-0 right-0 px-8 py-4 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                 <p className="text-white/80 text-sm font-medium tracking-wide">
                    {title}
                 </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Carousel>
    </div>
  );
}
