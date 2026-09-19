---
name: Metro Student Mobility System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#555e75'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#121b2f'
  on-primary-container: '#7a849c'
  inverse-primary: '#bdc6e0'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2fd'
  primary-fixed-dim: '#bdc6e0'
  on-primary-fixed: '#121b2f'
  on-primary-fixed-variant: '#3d475c'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.625rem
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.45'
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
  numeric-metric:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-performance utility experience that bridges premium consumer fintech with Apple-grade product minimalism. Designed specifically for university students navigating urban transit, the aesthetic balances rapid legibility under bright sunlight with a sophisticated, uncluttered visual cadence.

The emotional baseline is frictionless clarity, dependability, and modern authority. Core design vectors prioritize:
- **Utilitarian Speed:** Immediate time-to-value for gate taps, real-time vehicle arrivals, and live balance verification.
- **Fintech Precision:** Razor-sharp typographic hierarchies, structured micro-ledgers, and confident numeric emphasis.
- **Sculptural Minimalism:** Pure, layered white cards floating on crisp airy backdrops, accented by luminous oceanic blues and deep midnight structural anchors.

## Colors

The color system operates on high-contrast physical reality: transit hubs are chaotic and screen glare is constant. The base environment relies on crisp, airy architectural tones punctuated by deep midnight structural anchors and vivid transit-grade signifiers.

### Role Assignments
- **Primary Canvas (`#f8fafc`):** An expansive off-white ground providing daylight contrast without pure white eyestrain.
- **Card Surfaces (`#ffffff`):** Pure light reflectance for critical interactive cards, modular tokens, and floating elements.
- **Structural Deep Navy (`#0b1528`):** Anchors bottom tab bars, high-value primary CTA surfaces, QR pass containers, and heavy typography.
- **Transit Cyan (`#0ea5e9` & `#0284c7`):** Directs active transit states, lines, live motion indicators, and primary links.
- **Status Emerald (`#10b981`):** Communicates active passes, positive wallet balances, green transit savings, and tap-and-go validation.
- **Campus Indigo (`#6366f1`):** Highlights university-sponsored subsidies, special student badges, and institutional integration.
- **Text & Borders:** Headings deploy deep slate (`#0f172a`), running body text leverages dense neutral (`#334155`), muted microcopy sits at balanced slate (`#64748b`), and structural card dividers use hairline slate (`#e2e8f0`).

## Typography

Typography prioritizes tabular clarity and instant readability on the move. `Inter` acts as the uniform typographical engine across all viewports to preserve clean modern neo-grotesque neutrality.

- **Tabular Figures:** All financial readouts, departure countdowns, and platform numbers must enable `font-feature-settings: "tnum" 1` to prevent jitter during real-time data streaming.
- **Micro-Labels:** Uppercase metadata categories (e.g., `ZONE`, `VALID THRU`, `STUDENT ID`) employ `label-caps` with strict wide tracking (`0.08em`) to guarantee quick visual triage.
- **Metric Scalability:** The `numeric-metric` tier is dedicated strictly to wallet balances, remaining pass days, and arrival countdown minutes.

## Layout & Spacing

The layout model implements a fluid multi-tier grid designed around single-hand ergonomic reach on mobile and structured multi-pane modular cards on desktop.

- **Mobile Viewports (<640px):** Single-column layout. Content operates with a fixed `1rem` edge margin. Interactive touch zones stay pinned within the bottom thumb zone, with primary transit passes docked at the screen center.
- **Tablet (640px–1024px):** 6-column fluid grid, utilizing `margin-tablet` (`2rem`) and `gutter` (`1rem`). Route searches and pass telemetry transition into side-by-side modules.
- **Desktop (>1024px):** 12-column grid capped at a maximum width of `1280px` centered within `margin-desktop` (`3rem`). Content separates into dedicated navigational sidebars, central transit feeds, and persistent digital wallet utilities.

## Elevation & Depth

Visual hierarchy uses clean atmospheric physical layers, combining low-contrast border lines (`#e2e8f0`) with diffused ambient drop shadows rather than heavy structural lines.

- **Level 0 (Canvas Base):** Flat `#f8fafc` background; provides zero elevation anchor.
- **Level 1 (Card & Module Layer):** Pure `#ffffff` surface with a `1px` solid outline of `#e2e8f0` and an ambient shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.03)`.
- **Level 2 (Floating Elements & Modals):** Interactive sheet modules, active QR tap drawers, and bottom action pills. Elevated using an ambient drop shadow: `0 12px 32px -8px rgba(11, 21, 40, 0.12), 0 4px 12px -2px rgba(11, 21, 40, 0.05)`.
- **Level 3 (Overlay & QR Target):** Active physical boarding pass states and QR scanner focus overlays. Uses deep navy backplates (`#0b1528`) surrounded by luminous outer glows (`0 0 24px 0 rgba(14, 165, 233, 0.25)`).

## Shapes

The design system adopts a welcoming, tactile pill-forward geometry, using pronounced curvatures to channel handheld device hardware ergonomics.

- **Pill Shells (`rounded-full` / `9999px`):** Reserved for bottom navigation shells, route identifiers, countdown chips, interactive status badges, and inline segment toggles.
- **Large Surface Containers (`rounded-2xl` to `rounded-3xl` / `2rem` to `3rem`):** Primary physical transit passes, modal cards, and card groupings leverage generous curvature to soften high-density information arrays.
- **Input & Action Elements (`rounded-xl` / `1rem`):** Search bars, university credentials blocks, and standard secondary interactive buttons maintain structured, recognizable form factors without compromising touch surface areas.

## Components

### Buttons
- **Primary Action (Tap & Pay, Purchase Pass):** Deep navy background (`#0b1528`), white typography (`#ffffff`), `rounded-full`, `height: 52px`, `padding: 0 24px`. On press: scales down smoothly to `98%` with opacity `0.92`.
- **Secondary Action (Top Up, Transfer):** Crisp white background (`#ffffff`), border `1px solid #e2e8f0`, text color `#0f172a`. Subtle elevation change on hover/tap.
- **Accent Active (QR Activate):** Vivid Cyan background (`#0ea5e9`), pure white typography, gentle transit cyan ambient pulse ring.

### Floating Pill Navigation Bar
- Floats detached `16px` above the bottom safe area.
- Background uses frosted composite: `#ffffff` at 90% opacity with `16px` background blur and a hairline `#e2e8f0` border.
- Fully rounded (`rounded-full`). Contains four items: Pass, Routes, Wallet, Profile.
- Active states highlight using a dark navy pill capsule containing high-contrast white icons and text, while inactive items use `#64748b`.

### Transit Cards & University ID Header
- **Campus Header Bar:** Spans full mobile width; presents university crest or text mark paired with an active student status badge (Emerald pill `#10b981` with soft green background `#ecfdf5`), student ID micro-label, and quick-action notification bell.
- **Virtual Transit Pass:** Structural card (`rounded-3xl`) featuring a subtle gradient or dark navy container (`#0b1528`), dynamic QR/barcode viewport with punch-hole visual cutouts on the edges, live QR wave animation, and clear student subsidy tier indicators.

### Route Badges & Live Countdown Chips
- **Route Badges:** Compact pills (`rounded-full`) displaying route line codes (e.g., `M1`, `B42`, `L-Line`). High-contrast, line-specific color accents with bold `Inter` tracking.
- **Countdown Chips:** Pill containers featuring a dual-state design. Live updates display a pulsing green dot (`#10b981`) alongside bold minutes-to-arrival numerals (e.g., `3 min`). Delayed status shifts the chip tint to amber or crimson.

### Form Inputs & Station Search
- Soft white inputs with `1px` border (`#e2e8f0`), deep slate text (`#0f172a`), and `rounded-xl` geometry.
- Focus states shift the border to Transit Cyan (`#0ea5e9`) with a `3px` outer ring (`rgba(14, 165, 233, 0.15)`).
- Prefix icons host dedicated location pins, station glyphs, or search loupes in muted slate (`#64748b`).

### Checkboxes & Segmented Controls
- Segmented controls (e.g., "Bus | Metro | Commuter Rail") sit inside a light gray track (`#f1f5f9`) with an elevated pure white pill slider that smoothly transitions across selections.
- Checkbox selections utilize a rounded-square footprint (`rounded-md`), highlighting to `#0ea5e9` with a crisp white check icon when active.