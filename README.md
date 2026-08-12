# Oblivion UI

Liquid glass React components — frosted surfaces, oxblood accents, motion that
breathes.

Implements the **ObsidianUI** design system. Three rules it holds to:

1. **No gradients, anywhere.** Glass is a flat translucent fill + backdrop blur
   + one brighter top edge for the specular catch. Nothing interpolates.
2. **One accent.** Oxblood red, used sparingly — primary actions, active
   states, focus, glow. Everything else is white at low alpha.
3. **One motion curve.** `cubic-bezier(0.34, 1.56, 0.64, 1)` drives every
   hover, toggle and overlay. Ambient motion lives only in the backdrop orbs.

```bash
npm install oblivion-ui
```

```tsx
import { Orbs, GlassCard, GlassButton, ToastProvider } from 'oblivion-ui';
import 'oblivion-ui/styles.css';

export function App() {
  return (
    <ToastProvider>
      <Orbs />
      <GlassCard
        title="Substrata EP"
        description="Flat fill, backdrop blur, hairline border, bright top edge."
        footer={<GlassButton variant="primary">Summon</GlassButton>}
      />
    </ToastProvider>
  );
}
```

> **`<Orbs />` is not decoration.** Glass needs something behind it worth
> blurring — on flat colour the panes read as grey boxes. Render one at the
> root of your app.

The design specifies **Sora** (display) and **Hind** (body). The library only
names them in `--ob-font-display` / `--ob-font` with fallbacks; load them
yourself, or override the variables.

## Components

| Component | What it's for |
| --- | --- |
| `GlassSurface` | The material primitive. Everything else is this plus layout. |
| `Orbs` | Ambient backdrop — three drifting discs. `midnight` · `oxblood` · `charcoal`. |
| `GlassButton` | `primary` · `secondary` · `ghost` · `quiet` · `icon`, three sizes, loading. |
| `GlassCard` | Panel with optional eyebrow, title, description, media, aside, footer. |
| `GlassField` | The label / hint / error shell every field wears. Wrap your own controls in it. |
| `GlassInput` / `GlassTextarea` | Text fields with label, hint, error, affixes. |
| `GlassNumberInput` | `role="spinbutton"` with clamping, precision, hold-to-repeat steppers. |
| `GlassPinInput` | One-time-code cells — paste-aware, maskable, numeric or alphanumeric. |
| `GlassSelect<T>` | Listbox-backed select with full keyboard support. |
| `GlassCombobox<T>` | Type-to-filter select. Bring your own `filter`, or let it match on text. |
| `GlassTagInput` | Free-form chips, or multi-select when you pass `suggestions`. |
| `GlassDatePicker` | Date field with the calendar on a portalled popover. |
| `GlassCalendar` | The grid on its own — roving tabindex, `min`/`max`, per-day disabling. |
| `GlassFileDrop` | Drop zone that re-checks `accept` / `maxSize` / `maxFiles` on drop, not just in the picker. |
| `GlassSwitch` | Binary toggle, `role="switch"`. |
| `GlassCheckbox` | Checkbox with an inline label inside the hit target. |
| `GlassRadioGroup<T>` | Radio group with arrow-key navigation. |
| `GlassSlider` | Draggable slider with the standard keyboard contract. |
| `GlassBadge` | `accent` · `neutral` · `outline` · `status` · `solid`, optional dot. |
| `GlassAvatar` / `GlassAvatarGroup` | Image or initials; group collapses to `+N`. |
| `GlassTooltip` | Frosted tooltip on hover **and** focus. |
| `GlassProgress` | Determinate and indeterminate bars. |
| `GlassSpinner` / `GlassSkeleton` / `GlassSkeletonText` | Loading states. |
| `GlassList<T>` | Renders any array as rows. |
| `GlassTable<T>` | Generic columns, opt-in sorting, sticky header. |
| `GlassTabs<T>` | Segmented control with a sliding pill. |
| `GlassModal` | Portalled dialog: focus trap, scroll lock, Escape, scrim. |
| `GlassMenu` / `GlassDropdown` | Portalled action menu — roving arrow keys, Esc & outside-click dismiss, focus restore. |
| `Box` / `Stack` / `Flex` / `Grid` / `Container` / `Separator` | Polymorphic layout primitives with token-scale spacing. |
| `ToastProvider` / `useToast` | Queued toasts that stack and self-dismiss. |
| `ThemeProvider` / `useTheme` | Optional React wrapper over the `data-ob-theme` mechanism. |

## Data-driven by design

Nothing in the library knows the shape of your data. You describe how to read
it; the component handles layout, truncation, selection, empty and loading:

```tsx
<GlassList
  items={users}
  getKey={(u) => u.id}
  leading={(u) => <GlassAvatar name={u.name} />}
  primary={(u) => u.name}
  secondary={(u) => u.email}
  trailing={(u) => <GlassBadge>{u.plan}</GlassBadge>}
  onSelect={(u) => open(u)}
/>
```

```tsx
<GlassTable
  items={rows}
  columns={[
    { id: 'name', cell: (r) => r.name, sortBy: (r) => r.name },
    { id: 'bpm', header: 'BPM', align: 'end',
      cell: (r) => r.bpm, sortBy: (r) => r.bpm },
  ]}
/>
```

## Customizing

The form components take the same four kinds of escape hatch, so once you have
learned one you know the rest.

**`render*` — replace the interior, keep the behaviour.** These fill the inside
of a repeated element and leave the roles, keyboard handling and focus
management to the component. Each is handed the state it needs to follow along:

```tsx
<GlassCombobox
  items={people}
  renderOption={({ item, selected, active, disabled }) => …}
/>

<GlassCalendar
  renderDay={({ date, selected, today, outside, disabled }) => …}
/>
```

`renderOption`, `renderDay`, `renderTag`, `renderFile`, `renderTrigger`, and
`header` on the calendar, which swaps the caption and arrows outright.

**`format` / `parse` — decide how values become text.** `format` on
`GlassNumberInput` handles currency and separators, and the field shows the raw
number again while focused so the formatting never fights the caret.
`GlassCalendar` has `formatMonth`, `formatWeekday`, `formatDay` and
`formatDayLabel`; `GlassFileDrop` has `formatSize`.

**`classNames` — reach any part without a wrapper selector.** Every component
takes a `classNames` object keyed by part, alongside the `className` that lands
on the root:

```tsx
<GlassNumberInput classNames={{ well: 'my-well', step: 'my-stepper' }} />
```

**`icons` — swap the glyphs.** Every hardcoded mark is a prop: `icons.up` and
`icons.down` on the number input, `icons.clear` and `icons.caret` on the
combobox, `icons.upload` on the file drop, and so on.

Beyond those: every field forwards a `ref` to its primary control, accepts
`style`, works controlled (`value`) or uncontrolled (`defaultValue`), and takes
`orientation="horizontal"` to put the label beside the control instead of above
it.

## Polymorphic

Any component can become a different element and keeps that element's props:

```tsx
<GlassButton as="a" href="/docs">Docs</GlassButton>   {/* href is typed */}
<GlassSurface as="section" elevation="raised" />
```

## Elevation

| Value | What it does |
| --- | --- |
| `flush` | No cast shadow. |
| `default` | Hairline border, bright top edge, ambient shadow. |
| `raised` | Deeper shadow. |
| `overlay` | Darker, more opaque plate for modals, menus, toasts. |
| `well` | Inverted lighting — reads as cut into the glass. Inputs and tracks. |

## Toasts

```tsx
const { toast } = useToast();

toast('Render queued — 174 BPM');
toast('Deleted', { tone: 'danger', duration: 6000 });
toast('Saved', { tone: 'neutral', duration: 0 }); // stays until dismissed
```

## Theming

Every visual decision resolves to a CSS variable:

```css
:root {
  --ob-accent: 179 31 51;   /* note: space-separated RGB, no commas */
  --ob-bg: #0a0908;
  --ob-glass-blur: 22px;
  --ob-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

Colour tokens are bare RGB triplets so they compose with alpha via
`rgb(var(--ob-accent) / 0.4)`.

Five themes ship built in. Apply any of them anywhere — globally or to a
single subtree — with `data-ob-theme`:

```tsx
<div data-ob-theme="business">…</div>   {/* also: light, minimal, futuristic */}
```

| Theme | What it is |
| --- | --- |
| `oblivion` | The default. Smoked glass, oxblood accent. |
| `light` | Flips the recipe: white translucency, bright top edge, shadow instead of glow. |
| `business` | Near-flat corporate surface, cool slate, steel-blue accent, tighter corners. |
| `minimal` | The material disappears — opaque, no blur/glow/lift, one monochrome accent. Ships light **and** dark (add `data-ob-mode="light"`). |
| `futuristic` | Deep glass overclocked — cyan accent and a neon glow riding every surface. |

These are **distinct material languages**, not recolours: a small set of
material-switch tokens (`--ob-surface-fill`, `--ob-lift`, `--ob-surface-glow`)
lets a theme flatten or electrify the glass without touching any component CSS.

For state-driven switching in React, wrap your app in `ThemeProvider` and read
`useTheme()` — it mirrors the choice onto `data-ob-theme` / `data-ob-mode` and
respects `prefers-color-scheme` when the mode is `system`:

```tsx
import { ThemeProvider, useTheme, THEMES } from 'oblivion-ui';

<ThemeProvider defaultTheme="oblivion">
  <App />
</ThemeProvider>;

const { theme, setTheme } = useTheme();
```

The provider is optional — the CSS `data-ob-theme` mechanism works on its own.

See [`src/styles/tokens.css`](./src/styles/tokens.css) for the full token list
and [`src/styles/themes/`](./src/styles/themes/) for each theme.

## How the material works

```css
background:       rgb(255 255 255 / 0.055);   /* flat, never a gradient */
backdrop-filter:  blur(22px) saturate(150%);  /* what's behind it bends */
border:           1px solid rgb(255 255 255 / 0.11);
border-top-color: rgb(255 255 255 / 0.22);    /* the specular catch */
```

That last line does most of the work. It's what the eye reads as the lit rim of
a thick pane, and it's why the surface holds up over photography as well as
over flat colour. Recessed elements — inputs, slider tracks, table headers —
invert it: dark fill, *dimmer* top edge, so they read as cut in rather than
sitting on top.

`prefers-reduced-motion` zeroes every duration and stops the orbs. Browsers
without `backdrop-filter` fall back to an opaque plate.

## Development

```bash
npm install
npm run dev        # playground at localhost:5173
npm run build      # dist/ via tsup — ESM, CJS, .d.ts, styles.css
npm run typecheck
```

The playground has two pages: the landing page, and `#components` for the full
component sheet.

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
