import { MIND_PACKS, STYLE_PACKS, WORKROOMS } from "@enzo/decision-core";
import { WorkroomComposer } from "@/components/workroom-composer";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Compose a workroom" };
export default async function NewWorkroomPage() {
  const principal = await getWorkspacePrincipal();
  return <StudioShell active="/workrooms" demo={principal.demo}><header className="studio-header"><div><p className="eyebrow">Workroom composer</p><h1>Choose the help. Keep the decision.</h1></div><span className="tag">Founder controlled</span></header><WorkroomComposer workrooms={WORKROOMS} minds={MIND_PACKS} styles={STYLE_PACKS} /></StudioShell>;
}
