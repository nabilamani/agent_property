import { getAgent } from "@/app/actions/agent";
import { AgentProfileForm } from "@/components/admin/AgentProfileForm";
export default async function AdminProfilePage() {
  const agent = await getAgent();
  const displayAgent = agent || {
    name: "",
    phone: "",
    bio: "",
    photo: null,
    caption: "",
    logo: null,
  };

  return <AgentProfileForm agent={displayAgent} />;
}
