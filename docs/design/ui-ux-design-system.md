# UI/UX Design System & Wireframes

## Design Philosophy

**"Corporate Reliability × Modern Aesthetics"**

- High use of negative/vacant space — clean, uncluttered layouts
- Subtle glassmorphism on cards, modals, icons
- Trust-driven color palette: slate backgrounds, deep navy accents, emerald actions
- Typography: Inter (system-ui fallback) for body, Plus Jakarta Sans for headings
- 8px grid system, 4px baseline

---

## Color Palette

### Neutral (Backgrounds & Surfaces)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#0F172A` (slate-900) | Main page background |
| `bg-secondary` | `#1E293B` (slate-800) | Cards, panels |
| `bg-tertiary` | `#334155` (slate-700) | Hover states |
| `surface-glass` | `rgba(255,255,255,0.03)` | Glassmorphism backdrop |
| `surface-glass-border` | `rgba(255,255,255,0.08)` | Glass borders |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#0EA5E9` (sky-500) | Links, primary actions |
| `brand-secondary` | `#0891B2` (sky-600) | Hover states |
| `brand-dark` | `#0369A1` (sky-700) | Dark mode emphasis |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#10B981` (emerald-500) | Success states |
| `warning` | `#F59E0B` (amber-500) | Warnings |
| `error` | `#EF4444` (red-500) | Errors, destructive |
| `info` | `#3B82F6` (blue-500) | Info banners |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#F8FAFC` (slate-50) | Headings, main text |
| `text-secondary` | `#CBD5E1` (slate-300) | Captions, descriptions |
| `text-muted` | `#94A3B8` (slate-400) | Disabled, placeholders |
| `text-inverse` | `#0F172A` (slate-900) | Text on light backgrounds |

---

## Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `heading-1` | 3rem (48px) | 700 | 1.1 | Page H1 |
| `heading-2` | 2.25rem (36px) | 700 | 1.2 | Section H2 |
| `heading-3` | 1.875rem (30px) | 600 | 1.25 | Card H3 |
| `body-large` | 1.125rem (18px) | 400 | 1.6 | Lead text |
| `body` | 1rem (16px) | 400 | 1.6 | Body copy |
| `body-small` | 0.875rem (14px) | 400 | 1.5 | Captions |
| `label` | 0.875rem (14px) | 500 | 1.4 | Form labels |
| `caption` | 0.75rem (12px) | 400 | 1.4 | Timestamps, footnotes |

---

## Spacing Scale (8px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight gaps |
| `space-2` | 0.5rem (8px) | Component internal |
| `space-3` | 0.75rem (12px) | Between related elements |
| `space-4` | 1rem (16px) | Standard margin |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Large section gaps |
| `space-12` | 3rem (48px) | Page-level whitespace |
| `space-16` | 4rem (64px) | Hero section padding |

---

## Component Inventory (Full Library)

### Atoms

| Component | Props | Glassmorphism? | States |
|-----------|-------|----------------|--------|
| **Button** | variant, size, disabled, loading, icon | secondary only | default, hover, active, disabled, loading |
| **Input** | label, error, helper, size | yes | default, focus, error, disabled |
| **Textarea** | label, error, rows, maxLength | yes | default, focus, error |
| **Select** | options, label, error, size | yes | default, focus, error, loading |
| **Checkbox** | label, indeterminate | no | default, checked, indeterminate, disabled |
| **Radio** | options, label | no | default, checked, disabled |
| **Switch** | label, size | no | default, checked, disabled |
| **Badge** | variant, size | yes | default, hover |
| **Avatar** | size, fallback, src | yes | default, error, online |
| **Icon** | name, size, color | no | default, spinning |
| **Separator** | orientation, variant | no | default |

### Molecules

| Component | Props | Glassmorphism? | States |
|-----------|-------|----------------|--------|
| **Card** | padding, hover, border, shadow | yes | default, hover, selected |
| **StatCard** | value, label, trend, icon | yes | default |
| **FormField** | label, error, required, helper | yes | default, error, disabled |
| **SearchInput** | placeholder, onSearch, size | yes | default, focus, loading |
| **Tag** | color, removable, onRemove | yes | default, hover |
| **Chip** | label, variant | yes | default |
| **LinkCard** | title, description, icon, href | yes | default, hover |
| **Pagination** | page, total, onChange | no | default, disabled |
| **Breadcrumb** | items, separator | no | default |
| **Toast** | variant, duration, action | yes | default, dismiss |

### Organisms

| Component | Props | Glassmorphism? | States |
|-----------|-------|----------------|--------|
| **Navbar** | links, user, mobile | yes (backdrop blur) | default, scrolled, mobile-open |
| **Footer** | links, logo, social | no | default |
| **Hero** | heading, subheading, cta, image | yes (subtle) | default, loading |
| **FeatureGrid** | items, columns | yes | default |
| **Testimonial** | quote, author, rating | yes | default |
| **PricingCard** | plan, price, features, cta | yes | default, featured, disabled |
| **ProjectCard** | project, status, progress | yes | default, hover, completed |
| **TaskList** | tasks, filters, onUpdate | yes | default, loading, empty |
| **BookingCalendar** | slots, selected, onSelect | yes | default, loading |
| **DataTable** | columns, data, sorting, filtering | yes | default, loading, empty |
| **Modal** | size, closeOnBackdrop, children | yes | default, open, closing |
| **Drawer** | position, size, children | yes | default, open, closing |
| **Sidebar** | items, collapsible | yes | default, collapsed |

### Templates

| Template | Sections | Responsive Breakpoints |
|----------|----------|----------------------|
| **Marketing Page** | Navbar, Hero, FeatureGrid, Testimonial, CTA, Footer | xs→xl |
| **Landing Page** | Navbar, Hero, Stats, Features, Pricing, FAQ, Footer | xs→xl |
| **Dashboard** | Sidebar, Navbar, StatCards, ProjectGrid, RecentActivity | sm→xl |
| **Project Detail** | Navbar, Breadcrumb, Hero, Milestones, TaskList, Files | sm→xl |
| **Booking** | Navbar, Calendar, SlotList, Confirmation | xs→xl |
| **Auth Page** | Centered Card, Social Login, Form | xs→lg |

---

## Glassmorphism Specifications

```css
/* Glass card base */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Glass input */
.glass-input {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #F8FAFC;
}

.glass-input:focus {
  border-color: #0EA5E9;
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}
```

---

## Negative Space Guidelines

| Element | Minimum Spacing | Rationale |
|---------|----------------|-----------|
| Page margins (desktop) | `space-8` (2rem) | Room to breathe |
| Section vertical padding | `space-12` (3rem) | Clear section separation |
| Card padding | `space-6` (1.5rem) | Content breathing room |
| Between sections | `space-16` (4rem) | Dramatic pause |
| Hero content width | max-width: 720px | Readable line length |
| Container max-width | 1280px | Standard desktop |

**Rule**: Never crowd content. When in doubt, add more space.

---

## Animations & Micro-interactions

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `fade-in` | 300ms | ease-out | Page loads, modal opens |
| `slide-up` | 400ms | cubic-bezier(0.16, 1, 0.3, 1) | Cards entering view |
| `scale-in` | 200ms | ease-out | Button press, tooltip |
| `shimmer` | 1500ms | linear | Loading skeleton |
| `glass-hover` | 200ms | ease | Card hover lift |
| `progress-anim` | 800ms | ease-out | Progress bar fill |
| `checkbox-check` | 150ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Checkmark draw |

**Principles**:
- Respect `prefers-reduced-motion` — disable animations for users who prefer less motion
- All animations are optional enhancements, never required for functionality
- Stagger lists by 50ms between items
- Never animate layout-shift properties (width, height, top, left) — use transform/opacity

---

## Dark Mode Only (Primary Theme)

The site is dark-first. Light mode is not initially supported — focus on perfecting the dark aesthetic.

- Background: `#0F172A` (slate-900)
- All glassmorphism effects rely on dark backgrounds
- White text on dark surfaces with reduced opacity for secondary text

---

## Responsive Breakpoints (Tailwind)

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

**Mobile-first**: Default styles target mobile; larger screens override via `md:`, `lg:`, etc.

---

## Wireframes (Text Layouts)

### Home Page (Marketing)

```
┌─────────────────────────────────────────────────────────────┐
│ Logo                                    [Book a Consultation]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Hero Section — lots of negative space]                   │
│                                                             │
│       IT Consulting That Scales With Your Vision           │
│                                                             │
│  From local shops in India to enterprise teams in Europe,  │
│  we build secure, modern software — fast.                  │
│                                                             │
│  [Primary Button]  [Secondary Button]                       │
│                                                             │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Feature │  │ Feature │  │ Feature │  │ Feature │       │
│  │  Card   │  │  Card   │  │  Card   │  │  Card   │       │
│  │(glass)  │  │(glass)  │  │(glass)  │  │(glass)  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Case Studies                                       │   │
│  │  [Card] [Card] [Card] [Card] ... (scrollable)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Ready to start?                                    │   │
│  │  [Book a Consultation — full width CTA]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer: Links | Social | Newsletter | Copyright             │
└─────────────────────────────────────────────────────────────┘
```

### Client Dashboard

```
┌──────────────┬─────────────────────────────────────────────┐
│  Sidebar     │  Header                                     │
│              │  [Search] [Notifications] [Profile]         │
│  Projects    ├─────────────────────────────────────────────┤
│  • E-commerce│                                             │
│  • Mobile App│  StatCards: [Active Projects] [Invoices]   │
│  • ERP Setup │  [Tasks Due] [Files Shared]                 │
│              │                                             │
│  Bookings    │  ┌──────────────┐  ┌──────────────┐        │
│  • Tomorrow  │  │ Project Card │  │ Project Card │        │
│              │  │(glass)       │  │(glass)       │        │
│  Settings    │  │ Progress: 65%│  │ Progress: 30%│        │
│              │  └──────────────┘  └──────────────┘        │
│              │                                             │
│              │  ┌─────────────────────────────────────┐   │
│              │  │  Recent Tasks                       │   │
│              │  │  [ ] Design mockups      [Due Mon]  │   │
│              │  │  [ ] API integration      [Due Wed] │   │
│              │  │  [ ] Client review       [Done]     │   │
│              │  └─────────────────────────────────────┘   │
│              │                                             │
├──────────────┴─────────────────────────────────────────────┤
```

### Booking Form (Modal)

```
┌─────────────────────────────────────────────────────────────┐
│  Book a Consultation                          [✕]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Select a time slot                                         │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Mon 9AM │  │ Mon 2PM │  │ Tue 11AM│                     │
│  │ Available│ │ Available│ │Available│                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                             │
│  Your details                                               │
│                                                             │
│  Full Name  [____________________]                          │
│  Email      [____________________]                          │
│  Company    [____________________]                          │
│                                                             │
│  What do you need help with?                                │
│  [____________________________________________]             │
│                                                             │
│  [ Book Consultation — full width, primary ]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Case Study Card (Glassmorphism)

```
┌─────────────────────────────────────────────────────────────┐
│  [Featured Image — 16:9, rounded corners]                  │
│                                                             │
│  [Tag: E-commerce]  [Tag: India]  [Tag: Shopify]           │
│                                                             │
│  How a Local Shop Doubled Sales Online                     │
│                                                             │
│  A traditional textile shop in Jaipur needed an e-         │
│  commerce presence. We built a mobile-first store that     │
│  increased their monthly revenue by 2.3x in 6 months.     │
│                                                             │
│  [View Case Study →]                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | Minimum 4.5:1 for text, 3:1 for UI components |
| Focus visible | Custom focus ring: `2px solid #0EA5E9`, offset `2px` |
| Keyboard nav | All interactive elements reachable via Tab |
| Screen readers | ARIA labels on icons, live regions for toasts |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Touch targets | Minimum 44×44px for all interactive elements |
| Labels | Every input has a visible `<label>` |

---

## File Organization (Tailwind Config)

```
apps/web/src/styles/
├── globals.css          # Tailwind directives, base styles
├── tokens.css           # CSS custom properties (colors, spacing, typography)
├── glass.css            # Glassmorphism utilities
├── animations.css       # Keyframes and transition utilities
└── print.css            # Print-specific styles
```

Tailwind config (`tailwind.config.js`) extends:
- `colors`: brand, neutral, semantic tokens
- `spacing`: 8px grid scale
- `fontSize`: typography scale
- `borderRadius`: `sm: 0.375rem`, `md: 0.5rem`, `lg: 0.75rem`, `full: 9999px`
- `boxShadow`: glass, card, elevated variants

---

## Next Steps

1. Create `tailwind.config.js` with design tokens
2. Build atom components (Button, Input, Card, etc.)
3. Build molecule components (StatCard, FormField, SearchInput, etc.)
4. Build organism components (Navbar, Hero, ProjectCard, etc.)
5. Create page templates
6. Implement glassmorphism utilities
7. Set up animation utilities
8. Wire up localization structure (`apps/web/src/lib/i18n/`)