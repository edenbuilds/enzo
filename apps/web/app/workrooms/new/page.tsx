import { MIND_PACKS, STYLE_PACKS, WORKROOMS } from "@enzo/decision-core";
import { WorkroomComposer } from "@/components/workroom-composer";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Start new work" };
export default async function NewWorkroomPage() {
  const principal = await getWorkspacePrincipal();
  return <StudioShell active="/workrooms/new" demo={principal.demo}><header className="studio-header"><div><p className="eyebrow">New work</p><h1>Start with what feels stuck.</h1></div><span className="tag">No setup required</span></header><WorkroomComposer workrooms={WORKROOMS} minds={MIND_PACKS} styles={STYLE_PACKS} /></StudioShell>;
}
