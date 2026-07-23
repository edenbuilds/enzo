# Avenir — Enzo design reference

> Clarity, trust, substance.

Avenir is Enzo’s light editorial system: institutional deep navy, warm parchment, lifted white surfaces, controlled mono labels, and a single solar accent. It should feel like a senior strategist who brought evidence, not a dashboard competing for attention.

## Tokens

| Role                     | Token                    | Value     |
| ------------------------ | ------------------------ | --------- |
| Primary ink and surround | `--color-deep-navy`      | `#0b2e3c` |
| Cool hover wash          | `--color-mist-blue`      | `#b8cdd4` |
| Recessed surface         | `--color-dusk-stone`     | `#e5e3e1` |
| Elevated surface         | `--color-linen-lift`     | `#ffffff` |
| Canvas                   | `--color-warm-parchment` | `#f7f6f5` |
| Primary accent           | `--color-solar-accent`   | `#ffe96f` |
| Error                    | `--color-blush-error`    | `#d16c6c` |
| Success                  | `--color-fern-success`   | `#4f9b69` |
| Warning                  | `--color-amber-warning`  | `#9c741f` |

`--color-slate-teal` is a semantic alias of Deep Navy. Do not duplicate its raw value in components.

### Typography

- Headings: Lora 400 with a Georgia/serif fallback. Use tight negative tracking and no bold display weights.
- Body and controls: Inter Tight 400/500.
- Labels and metadata: Fragment Mono, uppercase, 12–14px, tracked.
- Display scale: 52, 64, and 88px, responsive through `clamp()` where appropriate.
- Body scale: 14, 16, and 24px.

### Geometry and rhythm

- Base unit: 4px.
- Spacing: 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120, 160, 200px.
- Buttons and inputs: 8px radius. Never use pill buttons.
- Cards: 12px radius. Large lifted surfaces: 20px.
- Page maximum: 1800px on a twelve-column fluid grid with 16px gutters.
- Desktop section spacing: 80–200px. Mobile sections never drop below 32px horizontal padding.

### Motion

- Card lift: 200ms ease, maximum 4px.
- UI transitions: 300ms linear.
- Disable non-essential movement under `prefers-reduced-motion`.

## Component rules

- Buttons: primary navy, secondary outlined, ghost text, accent solar. Solar is reserved for the principal action or a small circular mark.
- Cards: white over parchment; never use heavy shadows.
- Inputs: Dusk Stone recessed surface with visible navy focus.
- Alerts: semantic colors are functional only.
- Evidence blocks: show category, confidence, observation, meaning, and action.
- Report navigation: sticky on desktop, linearized on small screens.
- Tables and scorecards: use rules, spacing, and type hierarchy rather than decorative color.

## Page patterns

- Landing: full-viewport licensed professional photography, natural contrast, lower-left editorial headline, floating parchment navigation.
- Workspace: Deep Navy outer frame surrounding a lifted parchment canvas.
- Intake: editorial context beside a calm recessed form.
- Audit: sticky dark sidebar with spacious long-form findings and visible evidence confidence.
- Interview: one focused round at a time, clear radio-card selection, explicit progress.
- Vision Brief: publication-like hierarchy, sticky contents, numbered narrative, decisive closing action.

## Content voice

Use declarative, measured language. Prefer precise consequences over startup urgency and cleverness. Claims must either reveal evidence or declare themselves as inference. Metadata is laconic and functional.

## Accessibility

- Verify every foreground/background combination to WCAG AA.
- Deep Navy on Solar Accent is permitted only at verified sizes and weights.
- Preserve keyboard access, visible focus, semantic headings, labeled controls, and live status announcements.
- Never put meaning in color alone.
- Print views must remain readable without dark backgrounds.

The canonical implementation lives in `packages/design-system/src/tokens.css` and the reusable primitives exported by `@enzo/design-system`.
