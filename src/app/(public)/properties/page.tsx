import { getProperties } from "@/app/actions/properties";
import { getAgent } from "@/app/actions/agent";
import { PropertyListing } from "@/components/public/PropertyListing";
import { Suspense } from "react";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const typeFilter = typeof params.type === "string" ? params.type : undefined;

  const properties = await getProperties({
    type: typeFilter ? (typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)) : undefined,
  });

  const agent = await getAgent();
  const agentPhone = agent?.phone;

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading properties...</div>}>
      <PropertyListing 
        initialProperties={properties} 
        agentPhone={agentPhone}
        typeFilter={typeFilter}
      />
    </Suspense>
  );
}
