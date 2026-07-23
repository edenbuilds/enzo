import Link from "next/link";
import { EnzoPuppy } from "@enzo/design-system";
import { Interview } from "@/components/interview";

export const metadata = { title: "Vision interview" };

export default function VisionInterview() {
  return (
    <main className="interview-page">
      <header className="simple-header">
        <Link className="wordmark" href="/projects/demo">
          <span className="wordmark__puppy" aria-hidden="true"><EnzoPuppy /></span>
          <b>Enzo</b>
        </Link>
        <span className="eyebrow">Adaptive vision interview</span>
      </header>
      <Interview />
    </main>
  );
}
