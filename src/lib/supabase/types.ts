export type PropertyType = "Rumah" | "Tanah" | "Kavling" | "Cluster" | "Apartemen";
export type PropertyCondition = "Baru" | "Bekas" | "Indent";

export interface Agent {
  id: string;
  name: string;
  photo: string | null;
  bio: string | null;
  phone: string;
  logo: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  map_url: string | null;
  type: PropertyType;
  land_area: number;
  building_area: number;
  condition: PropertyCondition;
  description: string;
  agent_whatsapp: string;
  owner_whatsapp: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  position: number;
  created_at: string;
}

// Property with images joined
export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
}
