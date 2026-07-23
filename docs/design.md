# Enzo Broadsheet design reference

> Cream broadsheet, dark velvet chambers.

Enzo Broadsheet is an editorial software system built from warm paper, near-black rooms, large regular-weight serif type, direct borders, and a small set of deliberate accents. The interface should feel serious enough for a consequential founder decision and friendly enough to invite an unfinished thought.

## Foundation

| Role | Token | Value |
| --- | --- | --- |
| Primary action | `--color-lavender-whisper` | `#f0d7ff` |
| Secondary surface | `--color-forest-ink` | `#034f46` |
| Active state | `--color-ember-glow` | `#ffa946` |
| Primary ink and chamber | `--color-vast-ink` | `#1a1a1a` |
| Canvas and reversed text | `--color-lumen-cream` | `#ffffeb` |
| Quiet border | `--color-lumen-stone` | `#e4e4d0` |
| Muted text | `--color-fog` | `#74746b` |
| White puppy coat | `--color-pure-white` | `#ffffff` |

Use EB Garamond 400 for editorial headings. Use Figtree 400 through 700 for body copy, controls, labels, and metadata. EB Garamond falls back to Georgia and then a generic serif.

Display sizes range from 48px to 120px with tight line height. Body copy ranges from 16px to 22px. Authority comes from scale and clarity, not heavy display weights.

## Geometry and rhythm

- Base spacing unit: 8px.
- Page maximum: 1200px.
- Major section gap: 64px to 96px.
- Standard card padding: 32px.
- Buttons and inputs: 12px radius.
- Standard cards: 32px radius.
- Dark chambers: 40px to 80px radius.
- Navigation and status badges may use a full pill.
- Interactive elements use a 2px Vast Ink border.
- Cards and sections do not use decorative shadows.

## Product patterns

- Alternate cream broadsheet surfaces with dark chambers.
- Keep body copy left aligned and within a readable measure.
- Use Lavender Whisper for the primary action and selected states.
- Use Forest Ink for secondary panels, trusted status, and concentrated evidence.
- Use Ember Glow for active, warning, or live status details.
- Use borders, fill changes, and spacing for hierarchy. Do not use gradients.
- Keep Enzo’s own interface in Broadsheet. Selected styles affect generated work only.

## Enzo puppy

Enzo is an original white editorial-vector puppy with a Vast Ink outline. Lavender and Ember details may appear on the collar, tag, or state marker.

The puppy can listen, investigate, bring evidence, challenge, warn, wait, prepare to act, and review an outcome. Every state must include text and must remain understandable without motion or color.

Use the puppy prominently in the landing hero and selectively at important workflow moments. Avoid childish dialogue, photorealistic imagery, repeated dog jokes, or mascot decoration with no product meaning.

## Accessibility and motion

- Meet WCAG AA for text, controls, and meaningful graphics.
- Preserve visible focus and logical keyboard order.
- Use semantic headings, labeled controls, live regions, and useful error recovery.
- Do not rely on color, pose, or animation alone.
- Disable nonessential motion under `prefers-reduced-motion`.
- Keep print and PDF exports legible without dark backgrounds.

The canonical implementation lives in `packages/design-system/src/tokens.css` and the reusable primitives exported by `@enzo/design-system`.
