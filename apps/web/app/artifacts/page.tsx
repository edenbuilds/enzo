import { createFixtureStudio } from "@enzo/decision-core";
import { ArtifactEditor } from "@/components/artifact-editor";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";
export const metadata = { title: "Artifacts" };
export default async function ArtifactsPage() {
  const principal = await getWorkspacePrincipal();
  const studio = createFixtureStudio(principal.ownerId);
  return (
    <StudioShell active="/artifacts" demo={principal.demo}>
      <ArtifactEditor artifacts={studio.artifacts} />
    </StudioShell>
  );
}
