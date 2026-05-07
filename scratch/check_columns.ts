import { createClient } from "./src/lib/supabase/server";

async function checkColumns() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").limit(1);
  if (error) {
    console.error("Error fetching properties:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Columns in 'properties' table:", Object.keys(data[0]));
  } else {
    console.log("No data in 'properties' table to check columns.");
  }
}

checkColumns();
