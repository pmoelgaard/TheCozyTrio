# Master Plan v1 — TheCozyTrio

> This is the **verbatim** master build spec for TheCozyTrio, as handed to Claude Code.
> It is the durable source of truth for what we're building. Subsequent refinements live
> in `docs/master-plan-v2.md`, `v3.md`, etc. — never edit this file.

---

# Task: Build TheCozyTrio — Family Landing Page

## What to Build
A cute, playful, highly visual and interactive single-page landing page for a small family of 3:
- **Mother**: Filipina
- **Father**: Danish
- **Son**: 8-month-old baby — half Filipino, half Danish

The page should feel warm, personal, and fun. It should be packed with micro-interactions, playful animations, and hidden silly mini-games (easter eggs) scattered throughout.

## Key Feature: Boy/Girl Theme Toggle
A prominent, playful toggle switch that transitions the entire site between a "boy" theme (blues, astronauts, dinosaurs) and a "girl" theme (pinks, unicorns, flowers). Smooth 0.5s CSS transitions, persists in localStorage.

## Tech Stack & Architecture

### Angular App
- **Angular 19** standalone components (no NgModules)
- **SCSS** styling
- **No SSR**, no routing (single page)
- **PNPM** package manager

### XSite Suite (CRITICAL — read these repos first!)
The app is built on the **XSite** platform from XTND-DYNAMICS. Before writing any code, thoroughly read and understand:

1. **XSiteCore** at `../xsite-core/`. Read every source file. Understand app lifecycle, state management, event bus, component model. Use these APIs.
2. **XSiteUI** at `../xsite-ui/`. Read every source file. Understand available components (buttons, cards, toggles, modals, grids) and their APIs.
3. **XSiteTheme** at `../xsite-theme/`. Read every source file. Understand the theming engine, theme definitions, CSS custom property system, theme toggle mechanism.

**IMPORTANT**: Do NOT build your own component system, state management, event bus, or theme engine. Use what XSite provides. Wrap XSite services in Angular services for DI.

### Dependency Setup
- XSite packages as dependencies in `package.json`
- Use `pnpm link` for local symlinks (live updates from xsite-core/ui/theme)
- For CI/remote: reference via git URLs (`github:XTND-DYNAMICS/XSiteCore` etc., based on actual package.json names)

### Hosting
- **Cloudflare Pages** static deploy
- `wrangler.toml` config
- Build output to `dist/`

### Repository
- Branch: `claude/family-landing-page-iYonv`
- Repo: `pmoelgaard/thecozytrio`
- Commit and push when done

## Project Structure
```
TheCozyTrio/
├── package.json
├── angular.json
├── tsconfig.json
├── wrangler.toml
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                    # CSS vars, fonts, transitions
│   └── app/
│       ├── app.component.ts/html/scss
│       ├── app.config.ts
│       ├── sections/
│       │   ├── hero/
│       │   ├── family/
│       │   ├── culture-blend/
│       │   └── milestones/
│       ├── games/
│       │   ├── peek-a-boo/
│       │   ├── catch-pacifier/
│       │   ├── hidden-hearts/
│       │   ├── memory-match/
│       │   └── word-matcher/
│       └── shared/
│           ├── theme-toggle/
│           ├── floating-elements/
│           └── services/
│               ├── theme.service.ts   # Wraps XSite ThemeEngine
│               ├── game.service.ts
│               └── event-bus.service.ts # Wraps XSite EventBus
```

## Section Designs

### Hero
- Full viewport, "The Cozy Trio" with per-letter bounce-in
- Subtitle: "A Danish-Filipino love story, one tiny chapter at a time"
- Large SVG family scene (cozy house + 3 silhouettes)
- Theme toggle top-right
- Floating ambient elements (hearts, stars, notes) via CSS keyframes
- Themed gradient background

### Family — 3 character cards
**Mom (Nanay)**: Warm woman SVG, PH flag accent, sun icon, "Mahal kita" hover-reveal, warm yellows/reds. Easter egg: 5 clicks → karaoke animation
**Dad (Far)**: Tall man SVG, DK flag accent, Viking helmet icon, "Jeg elsker dig" hover-reveal, reds/whites. Easter egg: 5 clicks → hygge candle
**Baby (Sanggol/Baby)**: Crawling baby SVG, blended flags, mixed icons. Easter egg: click → Peek-a-boo game

All cards: hover wiggle+scale+shadow, scroll-reveal slide-up, use XSite UI Card if available

### Culture Blend — flip cards
1. Adobo vs Frikadeller
2. Bayanihan vs Hygge
3. Fiesta vs Julefrokost
4. "Kumusta" vs "Hej"
5. "Ili-ili Tulog Anay" vs "Byssan Lull"
6. Family-centric vs work-life balance

3D CSS flip on click, scroll-reveal stagger.

### Milestones — vertical timeline
Months 1-8: smile, cooing, head up, laughing, grabbing toys, sitting, first solid food, crawling. Alternates left/right desktop, line draws on scroll. Hidden trigger: click 8→1 to open Memory Match.

## Hidden Games

### 1. Peek-a-boo (click baby card)
Modal with baby face + cartoon hands. Click hands to part, reveal 5 different expressions. Confetti on completion.

### 2. Catch the Pacifier (hover Month 6 for 3s)
Modal with falling pacifier SVGs. Click to catch. 15s timer, increasing speed.

### 3. Hidden Hearts (always active)
10 invisible hearts across page. ~50px hover glow hint. Click to reveal with pop animation. Counter badge bottom-right. Find all 10 → heart rain. Persists in localStorage.

### 4. Memory Match (click milestones 8→1)
Modal 4×4 grid, 8 pairs (baby, bottle, PH flag, DK flag, heart, family, teddy, music). Standard rules. Move counter. Confetti on win.

### 5. Word Matcher (click "love" in footer 3x)
Modal with two columns, click-to-match Danish↔Filipino:
| Danish | Filipino | English |
|--------|----------|---------|
| Mor | Nanay | Mother |
| Far | Tatay | Father |
| Baby | Sanggol | Baby |
| Kærlighed | Pag-ibig | Love |
| Familie | Pamilya | Family |
| Hygge | Saya | Joy/Cozy |
| Tak | Salamat | Thank you |
| God nat | Magandang gabi | Good night |

Correct → green; wrong → shake; all matched → confetti.

## Theme Colors

### Boy
Primary `#4A90D9`, Light `#7EB6FF`, Dark `#2C5F9E`, Secondary `#6EC8A0`, Accent `#FFD166`, Background `#F0F7FF`, Surface `#FFFFFF`, blue-tinted shadows

### Girl
Primary `#E8729A`, Light `#F5A3C0`, Dark `#C44D78`, Secondary `#B388EB`, Accent `#FFD166`, Background `#FFF5F9`, Surface `#FFFFFF`, pink-tinted shadows

### Shared
Cultural accents: PH (`#0038A8`, `#CE1126`, `#FCD116`), DK (`#C60C30`, `#FFFFFF`)
Fonts: Baloo 2 (headings) + Nunito (body) from Google Fonts
Border-radius: 16px, spacing unit: 8px, transitions: 0.5s cubic-bezier(0.4, 0, 0.2, 1)

## QUALITY BAR: AWWWARDS-LEVEL — MIND-BLOWING
This isn't a template. It should feel like a handcrafted love letter. The kind of site that gets shared on Twitter, lands on Awwwards, and makes people stop scrolling. First impression: gasp.

### Must-Have "Wow" Moments
1. **Cinematic intro**: 2-3s intro, "The Cozy Trio" letters fly in from off-screen as particles, settle with bounce. Background fades black → themed gradient.
2. **Living illustration**: Hero SVG family scene is *alive* — Mom's hair sways, Dad blinks, Baby kicks, chimney smoke rises, leaves rustle.
3. **Theme toggle wipe**: Circular wipe radiates from toggle button across viewport, ~800ms with easing.
4. **Scroll storytelling**: Hero's baby crawls across screen as you scroll, growing through sections.
5. **Polaroid develop**: A faux Polaroid that "develops" (blur → sharp) on scroll.

### Visual Polish
- Parallax layers in hero (clouds at different speeds)
- Cursor trail (small hearts/stars follow cursor)
- Glassmorphism cards (backdrop-filter blur)
- Gradient mesh backgrounds that shift with theme
- Detailed Dribbble-quality SVGs with subtle animations (blinking eyes, breathing, swaying)
- Particle system in hero responding to mouse
- Smooth scroll with custom easing
- Cute family-themed loading animation (baby crawling progress bar)

### Micro-interactions
- Hover text → subtle color shift
- Hover cards → 3D tilt (perspective + rotateX/Y from mouse position)
- Click anywhere → tiny ripple
- Scroll progress indicator
- Konami code (↑↑↓↓←→←→BA) → secret family dance animation

### Sound Design (muted by default)
- Soft click sounds, lullaby music toggle, game sounds (pop/chime/giggle)

### Advanced Animations
- FLIP for layout changes
- Spring physics on toggle and cards (overshoot, not just ease)
- Stagger reveals with timed delays
- Morphing SVGs on theme switch (rocket → unicorn)
- Scroll-linked transformations (baby grows along timeline)

### Polish Details
- Themed custom scrollbar
- Themed selection color
- Beautiful glowing focus rings
- Baby emoji favicon
- Page title changes per state ("Peek-a-boo!", etc.)
- Open Graph meta + preview image
- Print stylesheet

## Implementation Order
1. READ XSite Core, UI, Theme thoroughly first
2. Scaffold Angular app + add XSite deps + pnpm link
3. Services (Theme, EventBus, Game wrapping XSite)
4. Theme system (boy/girl SCSS + CSS custom props)
5. Shared components (theme-toggle, floating-elements)
6. Sections: hero → family → culture-blend → milestones
7. Games: peek-a-boo → hidden-hearts → catch-pacifier → memory-match → word-matcher
8. Wire all easter egg triggers
9. Polish: responsive, a11y, performance
10. Cloudflare config
11. Commit & push to `claude/family-landing-page-iYonv`

## CRITICAL REMINDERS
- READ XSite repos first — don't reinvent
- Angular standalone components only
- All illustrations inline SVG/CSS — no external images
- CUTE and PLAYFUL — rounded, bouncy, warm
- Theme toggle must be DELIGHTFUL — circular wipe
- Polish games — animations + particle effects
- Mobile-first responsive
- Verify `pnpm build` succeeds before pushing
