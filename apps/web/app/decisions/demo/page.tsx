import { createFixtureStudio } from "@enzo/decision-core";
import { DecisionRoom } from "@/components/decision-room";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Decision Room" };
export default async function DecisionPage() {
  const principal = await getWorkspacePrincipal();
  return (
    <StudioShell active="/decisions/demo" demo={principal.demo}>
      <DecisionRoom studio={createFixtureStudio(principal.ownerId)} />
    </StudioShell>
  );
}
