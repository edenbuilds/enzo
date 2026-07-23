import { createFixtureStudio } from "@enzo/decision-core";
import { FdeWorkroom } from "@/components/fde-workroom";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Forward Deployed Engineering" };
export default async function FdePage() {
  const principal = await getWorkspacePrincipal();
  const run = createFixtureStudio(principal.ownerId).workroomRun;
  if (!run) return null;
  return <StudioShell active="/workrooms" demo={principal.demo}><header className="studio-header"><div><p className="eyebrow">Primary workroom</p><h1>Forward Deployed Engineering</h1></div><span className="tag">Two approvals required</span></header><FdeWorkroom run={run} /></StudioShell>;
}
