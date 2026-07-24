# Enzo Value-First UX Teardown

Source: the ten crawled pages supplied on 24 July 2026. This diagnosis is based on the copy and structure present in that crawl, not on product intent that is invisible to a user.

## 1. Value proposition and positioning reality check

### What Enzo says it is

The landing page calls Enzo a “Founder operating system” and promises: “Enzo finds what matters. You make the call.” It then describes a system of minds, workrooms, styles, evidence, decisions, artifacts, and production execution.

### What Enzo actually feels like

It feels like a catalog of AI configuration concepts wrapped around one good decision demo. The strongest product is buried at `/decisions/demo`, where evidence types, independent perspectives, disagreement, a recommendation, and a founder choice form a coherent sequence. The landing page does not sell that sequence. It sells the configuration layer.

“Founder operating system” is too broad to be credible at first contact. “Choose the minds you trust, the workroom you need, and the style that fits” describes internal machinery, not a founder outcome. It asks the visitor to understand Enzo’s taxonomy before Enzo understands the visitor’s problem.

The most concrete promise in the product is hidden in the decision room: turn evidence into a founder decision, preserve dissent, and review the outcome. That is sharper than “many useful ways to think” and more defensible than broad AI cofounder language.

### The ten-second exit

A new visitor leaves because the page does not answer four basic questions quickly enough:

1. What can I bring Enzo right now?
2. What will Enzo return?
3. How long until I see something useful?
4. Why is this better than asking a general AI assistant?

Instead, the visitor sees three abstractions: Mind, Workroom, and Style. “Start a workroom” sounds like starting a process, not receiving value. “Explore the public demo” is the safer option, but it opens a company dashboard with fixture metrics and assumes the visitor already understands the system.

## 2. Core logic and user flow breakdown

### Flow disconnects

- Landing to onboarding: the landing page promises a real company decision, but the main action opens a four-part composer.
- Composer to output: after selecting an outcome, workroom, minds, and style, the result is only “Workroom configured.” No analysis, evidence, or artifact appears.
- Demo to action: the company home and decision room demonstrate a strong finished state, but they do not show how a founder’s raw problem became that state.
- Catalog to work: every workroom card opens the same composer. The workroom descriptions imply distinct workflows, while the interaction is identical.
- Engineering to execution: the Forward Deployed Engineering page asks for approval and flips pending checks, but the crawl shows no repository evidence, diff, test output, rollback detail, or actual execution result.

### Information architecture gaps

The app has nine top-level studio destinations: Company home, Company memory, Workrooms, Minds, Styles, Decision room, Research board, Artifacts, and Decision ledger. This exposes the database model as navigation. A founder does not arrive thinking “I need a style catalog.” They arrive thinking “trial conversion is weak” or “should we ship this change?”

There is no visible inbox or single starting point for a new problem. There is also no clear object hierarchy connecting company, problem, run, decision, artifact, and review. “Company home” and “Company memory” sound adjacent, while “Decision room” and “Decision ledger” require prior knowledge of Enzo’s model.

### Action paralysis

The composer requests four choices before showing proof:

1. Desired outcome
2. One of eight workrooms
3. One or more named minds
4. One of eight output styles

The mind selection is especially costly. A founder is asked to choose Steve Jobs or Charlie Munger before seeing the question Enzo thinks each perspective can answer. Six additional minds are shown as “research” and unavailable, which turns product uncertainty into visible interface noise.

Styles are also premature. Choosing between Swiss Precision, Luxury Minimal, and Cinematic Product before a useful artifact exists is decoration before substance.

## 3. UI, UX system, and interaction design gaps

### Confusing patterns

- Catalog cards make methods look like products. Competence details are useful in an advanced library, not as a required entry point.
- The studio sidebar treats system concepts and user goals as equals.
- “Production” and “research” labels read like internal governance statuses. They are important for trust, but their current prominence competes with the task.
- The public demo mixes real product affordances with fixture behavior. “Approve execution” looks consequential even though nothing is executed.
- Workroom configuration uses large option grids, creating visual confidence without creating functional progress.

### Cognitive friction

The interface asks the founder to supply a desired outcome and then make methodological choices Enzo should be qualified to recommend. There is no live interpretation, example transformation, evidence preview, or suggested decision until after the user leaves the composer and manually enters the demo.

The product’s best trust mechanism, separating verified, researched, and hypothetical claims, appears late. It should appear in the first response because it is the clearest proof that Enzo behaves differently from a generic assistant.

### Navigation and hierarchy failures

The sidebar has no hierarchy or grouping. Primary actions, memory, catalogs, work outputs, and historical records all share the same visual level. The landing navigation repeats Workrooms, Minds, and Styles, reinforcing the false idea that browsing the system is the main job.

The typography and Broadsheet visual system are distinctive, but oversized editorial headings are used on configuration pages where compact task clarity matters more. The visual system is coherent. The interaction hierarchy is not.

## 4. The value-first flow

### Step 1: Bring the knot

Ask one question: “What are you trying to decide or ship?” Allow an optional URL or evidence attachment. Do not require a workroom, mind, or style.

Primary action: **Get Enzo’s first read**.

### Step 2: See the first read

Return an immediate, useful response that contains:

- The decision hiding underneath the request
- One sharp interpretation
- Three facts Enzo would verify next
- The recommended workroom and smallest useful council
- A clear statement of what is assumed

This is the aha moment. The founder sees that Enzo can frame the problem before asking for more setup.

### Step 3: Make the call

Let the founder open the full evidence scan, adjust the recommended approach, or approve the next action. Styles appear only when an artifact will actually be generated. Named minds live inside an “Adjust Enzo’s approach” disclosure and remain competence-first.

### Remove, hide, and emphasize

Remove from primary navigation:

- Minds
- Styles
- Research board
- Workroom catalog

Keep them available as advanced libraries or contextual controls.

Hide behind defaults:

- Workroom selection
- Council selection
- Output style
- Evaluation and provenance details, unless trust or availability requires disclosure

Place front and center:

- A single text field for the founder’s real problem
- The action “Get Enzo’s first read”
- An immediate evidence-aware interpretation

## 5. Immediate tactical action plan

### 1. Replace the workroom composer with a value-first start

Ship one problem field, an optional source, and an immediate first read. The system should recommend its own workroom and council. This removes the largest completion barrier.

### 2. Collapse navigation around founder tasks

Use: Company home, Start new work, Open decision, Work and artifacts, Company memory, and Decision ledger. Move Minds, Styles, Research, and Workrooms out of the primary sidebar.

### 3. Make the first response prove Enzo’s difference

Show the hidden decision, the signal, what Enzo will verify, and the selected route. Keep claims visibly classified when the full scan begins.

### 4. Replace fake completion with a worked result

Delete “Workroom configured” as an endpoint. Route the public demo into a complete worked decision. For engineering, do not present simulated approvals as execution. Show fixture repository evidence, a sample diff, checks, and a clearly labeled simulated deployment result.

### 5. Build an ownable character system

Keep Enzo white, friendly, and compact, but give the puppy a recognizable silhouette: one upright ear, one folded ear, a lavender eye patch, a forest body spot, and an ember diamond tag. Use this consistently at icon, wordmark, guide, and state sizes. Do not imitate an existing character’s anatomy, pose, or accessories.

## Implemented response

This redesign applies the first three changes immediately. The landing page and new-work route now start with the founder’s problem, return a deterministic first read, recommend a route, and place method controls behind an optional disclosure. Primary navigation now follows founder tasks. The mascot has been rebuilt as an original vector system with a distinctive silhouette and small-scale brand cues.
