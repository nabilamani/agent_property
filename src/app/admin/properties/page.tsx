import { getProperties } from "@/app/actions/properties";
import { PropertyTable } from "@/components/admin/PropertyTable";
export default async function AdminPropertiesPage() {
  const properties = await getProperties({ activeOnly: false });

  return (
    <PropertyTable
      properties={properties.map((p) => ({
        ...p,
        price: Number(p.price),
      }))}
    />
  );
}
