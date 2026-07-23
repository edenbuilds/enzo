import Link from "next/link";
import { Nav } from "@/components/nav";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Workspace" };

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return (
    <main className="workspace-shell">
      <Nav compact />
      <section className="workspace">
        <header className="workspace__header">
          <div>
            <p className="eyebrow">Private workspace</p>
            <h1>
              Good evening
              {data.user?.user_metadata?.name ? `, ${data.user.user_metadata.name}` : ""}.
            </h1>
          </div>
          <Link className="button button--accent" href="/audit/new">
            New interrogation
          </Link>
        </header>
        {!isSupabaseConfigured() ? (
          <div className="demo-notice">
            <span className="eyebrow">Demo mode</span>
            <p>
              Connect Supabase to enable private projects, OAuth, storage, and share-link
              revocation.
            </p>
          </div>
        ) : null}
        <div className="dashboard-grid">
          <Link className="project-card project-card--featured" href="/home">
            <div className="project-card__top">
              <span className="tag">Decision ready</span>
              <span className="eyebrow">Founder studio</span>
            </div>
            <h2>What should this product promise first?</h2>
            <p>Review the evidence, challenge three independent lenses, and record your choice.</p>
          </Link>
          <Link className="project-card project-card--featured" href="/projects/demo">
            <div className="project-card__top">
              <span className="tag">Audit complete</span>
              <span className="eyebrow">Updated today</span>
            </div>
            <h2>A sharper first impression</h2>
            <p>
              Positioning, conversion, trust, and responsive evidence collected across two
              viewports.
            </p>
            <div className="score-ring" aria-label="Audit score 64 out of 100">
              <strong>64</strong>
              <span>/100</span>
            </div>
          </Link>
          <article className="project-card project-card--empty">
            <span className="eyebrow">Evidence queue</span>
            <h2>Nothing waiting.</h2>
            <p>Add a URL, screenshot, PDF, public repository, or local codebase fact.</p>
            <Link className="text-link" href="/audit/new">
              Collect evidence →
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
