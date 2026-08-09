# Oblivion UI

Smoked-glass React components hung between two lights.

Cold bone falls on every pane from above. Ember burns up at it from below.
Nothing is lit evenly and nothing is neutral — that duality is the whole design,
and it's carried by two inset hairlines on every surface.

**No gradients. Anywhere.** Not in fills, borders, or text. Softness comes from
blur and shadow; never from colour interpolation.

```bash
npm install oblivion-ui
```

```tsx
import { Emberfall, GlassCard, GlassButton } from 'oblivion-ui';
import 'oblivion-ui/styles.css';

export function App() {
  return (
    <>
      <Emberfall />
      <GlassCard
        eyebrow="01"
        title="Surface"
        description="Bone above, ember below, blur between."
        footer={<GlassButton variant="solid">Summon</GlassButton>}
      />
    </>
  );
}
```

> **`<Emberfall />` is not decoration.** Smoked glass needs something behind it
> to be worth blurring. On a plain background the surfaces read as flat grey
> boxes. Render one at the root of your app.

## The rules this system holds to

1. **No gradients.** Not in fills, not in borders, not in text. Flat colour
   only. A masked gradient ring is the fastest way to make a UI look generated.
2. **Two light sources, always.** `inset 0 1px 0` in bone on the top edge,
   `inset 0 -1px 0` in ember on the bottom. Every surface, every variant.
3. **Every black is warm.** Cool blue-blacks read as space. Warm blacks read as
   char and cooling metal — `#080706`, not `#05060a`.
4. **Muted pigment, not neon.** Burnt orange `#d65c20`, sanctuary gold
   `#e7c179`. Nothing fluoresces.
5. **Nothing snaps.** 300ms on a decelerating curve. Panes rise toward the
   light on hover and settle on press.

## Components

| Component | What it's for |
| --- | --- |
| `GlassSurface` | The material primitive. Everything else is this plus layout. |
| `Emberfall` | Backdrop: turning halo, hairline lattice, cinders off a hot seam. |
| `GlassButton` | `glass` · `solid` · `ghost` · `outline` · `danger`, three sizes, loading state. |
| `GlassCard` | Panel with optional eyebrow, title, description, media, aside, footer. |
| `GlassInput` / `GlassTextarea` | Text fields with label, hint, error, affixes, fully wired for a11y. |
| `GlassBadge` | Status pills across seven tones, with optional pulsing dot. |
| `GlassList<T>` | Renders any array as rows. Accessors or a full `renderItem` escape hatch. |
| `GlassTable<T>` | Generic columns, opt-in client-side sorting, sticky header. |
| `GlassTabs<T>` | Segmented control with a sliding glass pane and arrow-key navigation. |
| `GlassModal` | Portalled dialog: focus trap, scroll lock, Escape, scrim, focus restore. |

## Data-driven by design

Nothing in the library knows the shape of your data. You describe how to read
it and the component handles layout, truncation, selection, empty and loading
states:

```tsx
<GlassList
  items={users}
  getKey={(u) => u.id}
  leading={(u) => <Avatar src={u.avatar} />}
  primary={(u) => u.name}
  secondary={(u) => u.email}
  trailing={(u) => <GlassBadge tone="halo">{u.plan}</GlassBadge>}
  onSelect={(u) => open(u)}
/>
```

```tsx
<GlassTable
  items={rows}
  columns={[
    { id: 'name', cell: (r) => r.name, sortBy: (r) => r.name },
    { id: 'spend', header: 'Spend', align: 'end',
      cell: (r) => `$${r.spend}`, sortBy: (r) => r.spend },
  ]}
/>
```

When accessors aren't enough, `GlassList` takes `renderItem` and you own the
row entirely.

## Polymorphic

Any component can become a different element and keeps that element's prop
types:

```tsx
<GlassButton as="a" href="/docs">Docs</GlassButton>   {/* href is typed */}
<GlassCard as="article" />
<GlassSurface as="aside" elevation="haloed" />
```

## Elevation

| Value | What it does |
| --- | --- |
| `flush` | Edge lighting only, no cast shadow. |
| `default` | Edge lighting plus an ambient shadow. |
| `raised` | Longer, softer shadow. |
| `haloed` | Both registers turned up: a gold arc breaking over the top edge, heat pooling beneath. |

`sheen` (on by default) rakes two flat specular bands across the pane, which
slide as you hover. They're skewed solid bars — a radial falloff would be a
gradient.

## Theming

Every visual decision resolves to a CSS variable. Override them anywhere —
globally, or scoped to a subtree:

```css
:root {
  --ob-ember: 168 32 32;      /* note: space-separated RGB, no commas */
  --ob-halo: 231 193 121;
  --ob-char-0: #0a0505;
  --ob-glass-blur: 24px;
  --ob-glass-brightness: 1.4; /* how much the pane lifts what's behind it */
}
```

Colour tokens are bare RGB triplets so they compose with alpha via
`rgb(var(--ob-ember) / 0.4)`.

Three presets ship built in — apply with `data-ob-theme`:

```tsx
<div data-ob-theme="ichor">…</div>   {/* also: "seraph", "ash" */}
```

`seraph` is the angel winning — gold above, heat banked low. `ichor` is the
demon winning: arterial, close, wet. `ash` is what's left when both leave.

See [`src/styles/tokens.css`](./src/styles/tokens.css) for the full token list.

## How the material works

Each surface is four layers, none of them a gradient:

1. **Body** — translucent warm fill, `backdrop-filter: blur() saturate()
   brightness()`, a hairline border, and the two inset edge lights.
2. **Sheen** — two hard-edged bands skewed across the pane, above the fill and
   below the text so they light the glass without washing the copy.
3. **Grain** — `feTurbulence` noise at 4%, so flat fills aren't dead plastic.
4. **`::before`** — the gold halo arc, on `haloed` surfaces.

**Why the glass is actually visible.** Two things, and both are required.
`brightness()` makes the pane read lighter than what surrounds it. And the
backdrop is deliberately full of hard structure — `Emberfall` draws a hairline
lattice, concentric halo rings, and hard cinders. `backdrop-filter` can only be
seen where it has something sharp to soften; over a flat background it does
nothing at all, and the panes collapse into grey boxes.

`prefers-reduced-motion` zeroes every duration and parks the embers and the
halo. Browsers without `backdrop-filter` fall back to opaque char.

## Development

```bash
npm install
npm run dev        # playground at localhost:5173
npm run build      # dist/ via tsup — ESM, CJS, .d.ts, styles.css
npm run typecheck
```

## License

Oblivion UI is licensed under the [Apache License 2.0](./LICENSE).

**You can use it freely**, including in commercial products, closed-source
projects, and client work. You do not owe us money, and you do not have to
open-source your own code.

What the license asks of you:

- Keep the copyright notice and a copy of the license with any redistribution
- Include the [NOTICE](./NOTICE) file if you redistribute the source or a
  substantial portion of it
- State significant changes if you distribute a modified version
- Don't use the **Oblivion UI** name or logo to brand your own product — see
  [TRADEMARK.md](./TRADEMARK.md)

In short: build whatever you want with it, ship it, sell it. Just don't pass it
off as your own work, and don't sell something called "Oblivion UI".
