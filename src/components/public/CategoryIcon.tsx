import { 
  Home, 
  Palmtree, 
  Box, 
  Building, 
  Building2, 
  LayoutGrid,
  Heart
} from "lucide-react";

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case "semua":
      return <LayoutGrid className={className} />;
    case "rumah":
      return <Home className={className} />;
    case "tanah":
      return <Palmtree className={className} />;
    case "kavling":
      return <Box className={className} />;
    case "cluster":
      return <Building className={className} />;
    case "apartemen":
      return <Building2 className={className} />;
    case "tersimpan":
      return <Heart className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
}
