import { WorkroomComposer } from "@/components/workroom-composer";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Start new work" };
export default async function NewWorkroomPage() {
  const principal = await getWorkspacePrincipal();
  return <StudioShell active="/workrooms/new" demo={principal.demo}><header className="studio-header"><div><p className="eyebrow">New interrogation</p><h1>Bring a live page. Leave with a move.</h1></div><span className="tag">No setup required</span></header><WorkroomComposer /></StudioShell>;
}
