# Founder decision studio MVP

## The proof loop

Give Enzo real company context, inspect the current evidence, route the smallest useful set of lenses, expose disagreement, capture the founder's final decision, generate one editable artifact, and remember the expected outcome and review date.

The existing audit-to-Vision-Brief flow supplies ingestion, evidence discipline, adaptive clarification, and artifact output. The next vertical slice extends it instead of rewriting it.

## Milestones

1. Add FounderProfile, CompanyModel, Decision, CouncilRun, LensAnalysis, Artifact, Experiment, and OutcomeReview schemas and RLS policies.
2. Implement one Decision Room for “What should the product promise first?” using deterministic fixtures plus optional model execution.
3. Create three Enzo-owned lenses: product focus, operator/customer, and inversion/risk. They are competence-based domain packs first; named-person packs remain gated by provenance and evaluation.
4. Run independent diagnoses before the disagreement round. Persist evidence, assumptions, dissent, founder choice, success metric, and review date.
5. Generate a Decision Memo and 30-day action plan connected to the originating evidence.
6. Add outcome review and confidence calibration to the Decision Ledger.

## Acceptance

The slice is complete when a founder can create or select a company, submit context, receive a source-visible council analysis, make a decision, edit the artifact, revisit the ledger entry, and record whether the expected outcome occurred. The no-credential fixture path must remain fully usable.
