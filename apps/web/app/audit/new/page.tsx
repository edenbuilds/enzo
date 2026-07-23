import Link from "next/link";
import { AuditIntake } from "@/components/audit-intake";

export const metadata = { title: "New audit" };

export default function NewAudit() {
  return (
    <main className="intake-page">
      <header className="simple-header">
        <Link className="wordmark" href="/">
          <span>EI</span>
          <b>Enzo</b>
        </Link>
        <Link href="/dashboard">Close</Link>
      </header>
      <section className="intake-layout">
        <aside>
          <p className="eyebrow">New interrogation</p>
          <h1>Begin with what can be observed.</h1>
          <p>
            One strong artifact is enough to start. Coverage gaps stay visible until the evidence
            earns a stronger conclusion.
          </p>
        </aside>
        <AuditIntake />
      </section>
    </main>
  );
}
