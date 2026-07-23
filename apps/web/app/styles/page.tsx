import { STYLE_PACKS } from "@enzo/decision-core";
import type { CSSProperties } from "react";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Styles" };
export default async function StylesPage() {
  const principal = await getWorkspacePrincipal();
  return (
    <StudioShell active="/styles" demo={principal.demo}>
      <header className="catalog-hero"><div><p className="eyebrow">Style library</p><h1>Give the work a direction, not a costume.</h1></div><p>Styles govern generated artifacts. Enzo always stays Enzo Broadsheet.</p></header>
      <section className="style-grid" data-testid="style-catalog">
        {STYLE_PACKS.map((style, index) => (
          <article className={`style-card style-card--${index + 1}`} key={style.id}>
            <div className="style-card__sample" style={{ "--style-accent": style.tokens.accent } as CSSProperties}><span>Aa</span><i /></div>
            <p className="eyebrow">Output style</p><h2>{style.displayName}</h2><p>{style.summary}</p>
            <div className="style-card__meta"><span>{style.typography.join(" + ")}</span><span>{style.exportFormats.join(" · ")}</span></div>
          </article>
        ))}
      </section>
    </StudioShell>
  );
}
