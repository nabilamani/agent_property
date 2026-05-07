import { getProperties } from "@/app/actions/properties";
import { getAgent } from "@/app/actions/agent";
import { PropertyTable } from "@/components/admin/PropertyTable";

export default async function AdminPropertiesPage() {
  const [properties, agent] = await Promise.all([
    getProperties({ activeOnly: false }),
    getAgent()
  ]);

  return (
    <PropertyTable
      properties={properties.map((p) => ({
        ...p,
        price: Number(p.price),
      }))}
      agentPhone={agent?.phone || "6281234567890"}
    />
  );
}
