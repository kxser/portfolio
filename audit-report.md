# Portfolio Audit — derinaritter.com

**Stack mapped from repo:**
- Nuxt 4 (Vue 3) — `nuxt.config.ts`, srcDir `app/`
- Modules: `@nuxt/ui` (v4), `motion-v`, `@nuxt/image`
- Styling: Tailwind v4 via `@nuxt/ui`, single CSS file `app/assets/css/main.css`
- Pages: `app/pages/index.vue` (one-pager) and `app/pages/astar.vue` (A* visualizer using `p5`)
- Deploy: Cloudflare Workers via Nitro `cloudflare_module` preset (`wrangler.jsonc`); deploy script in `deploy.sh`
- Static assets in `public/` (favicon, signature PNG, two credential JPGs)
- Only build output `_headers` file sets cache-control on `_nuxt/*` and `_fonts/*`; **no security headers anywhere**

Sub-domain `blog.derinaritter.com` is referenced but is a separate property — out of scope here.

---

## 1. Psychological / Retention Audit

### First 5 seconds (above the fold)

The visitor lands on the left rail (which is sticky on `lg:`):

- H1 "Derin Alan Ritter" — `app/pages/index.vue:40`
- **Empty `<motion.h2>`** — `app/pages/index.vue:42-47` (no children inside the tag)
- Italic tagline "Always outnumbered, never outgunned" — `app/pages/index.vue:54`
- Nav (About / Experience / Projects / Credentials)
- BLOG / RESUME links, 5 social icons

**Verdict: there is no value proposition above the fold.** The empty H2 was probably meant to hold a one-line role description ("Computer-science student building X" or similar). The italic line is a Mos Def lyric — evocative but opaque to a cold recruiter. A visitor at 0-5s sees a name and a poetic quote and has to scroll to the right-hand column to discover this is a CS student's portfolio.

**Fix:** put the value prop in `index.vue:42-47`. Something like:
```
17-year-old building production Nuxt + ML systems in Ankara.
Currently CTO @ The College Chronicle. Heading to university 2026.
```
Concrete identity, concrete role, concrete timeline. Keep the "Always outnumbered…" line as a small subtitle if you want flavor — but the role line earns the right to be poetic.

### Cognitive load

Reasonable. Two columns; left rail is identity + nav, right is content. The four nav items map cleanly to scroll targets. No major Hick's law violation.

One nit: the left rail has **two redundant resume entry points** — the RESUME pill (`index.vue:142-150`) and the "View Resume →" link inside the About section (`index.vue:252-260`). Both point to the same Google Doc. Keep the contextual one (in About), drop the top-rail RESUME, free up that slot for something else (e.g. a "Get in touch" CTA).

### Social proof / credibility

**Strong:** SAT 1500/1600, IELTS 8.5/9 — both specific, both with redacted score reports linked. `index.vue:662-677`.

**Weak / weakest entries:**
- "Duke University, Web Scraping with Python" — `index.vue:679` — Coursera 4-week course, not a Duke credential in any meaningful sense. The framing implies more than the credential is.
- "Introduction to Personal Finance" (SoFi) — `index.vue:699-705` — irrelevant to a CS portfolio and dilutes the stronger items.
- "Linux for Developers" / "Open Source Software Development Methods" — Linux Foundation intro courses. Fine as filler, but they're below SAT/IELTS visually — flip the order so the strongest credentials are top of the list.

**Experience section, framed as nouns rather than outcomes:**
- "Spearheaded breakaway newspaper branch. Built its entire digital infrastructure, website & directed editorial content." (`index.vue:606`) — what does the infrastructure look like? How many readers/articles? Where's the link?
- "Responsible for managing, developing, and deploying the I.T. infrastructure for a 300-person M.U.N. conference" (`index.vue:612-613`) — the "300-person" is the only number on the page in this section. Good — add more like it elsewhere.
- "Developed the fastest AprilTag recognition algorithm" (`index.vue:641`) — "fastest" is strong but unverifiable. Fastest by what metric? "Reduced detection latency from Xms → Yms on a Raspberry Pi" would be far stronger.
- "Collaborated and gained insightful experience" (`index.vue:634`) — pure filler. Cut or replace with one concrete artifact.

**Project descriptions:**
- "Reduced costs and inference time significantly compared to generalized models" (`index.vue:712-714`) — quantify. "Significantly" is the weakest word on the page. If you fine-tuned Qwen3-4B, you have eval numbers. Show them.

### Narrative arc

There isn't one. The page is About → Experience → Projects → Credentials — a CV in scroll form. Consider a single sentence threading the "why": e.g. "I started building because [X] and now I focus on [Y]." Right now the About paragraph gestures at "creative solutions regardless of unique constraints" without telling a story.

### Buzzword filler — flagged with proposed rewrites

| Location | Phrase | Rewrite |
|---|---|---|
| `index.vue:225` | "I'm an aspiring student" | "I'm a high-school senior" (factual; "aspiring student" makes no sense — you're already a student) |
| `index.vue:225` | "creative solutions regardless of unique constraints" | Drop. Show, don't tell. The projects section is your evidence. |
| `index.vue:225` | "I aim to create performant yet elegant systems" | Pick one project where you actually did this and link it. |
| `index.vue:243` | "remarkably diverse environments, from the focused autonomy of working remotely at the top of the Alps to the collaborative and structured setting of a leading electronics design company" | "I've worked remote from the Alps and in-person at MEGART Technology (electronics design, Ankara)." Halve the words, double the specificity. |
| `index.vue:243` | "I frequently leverage my reputation as the school's primary technical troubleshooter" | Unverifiable self-praise. Cut, or replace with a single concrete example ("I built the registration system used by MCMUN's 300 delegates"). |
| `index.vue:634` | "Collaborated and gained insightful experience" | Name one thing you shipped or learned. |

### Reciprocity / curiosity gaps

The site is currently a one-way pitch. The BLOG link (`index.vue:131-140`) is the closest thing to a reciprocity hook — leading with a recent post title or excerpt above the fold would convert curious visitors. The A* visualizer is a great reciprocity artifact; consider surfacing a teaser screenshot or live mini-preview in the projects card rather than a text description.

### Friction to contact

The email link is the worst offender: clicking `derinaritter@protonmail.ch` in the social rail (`index.vue:536`, handler at `index.vue:544-552`) **copies to clipboard** rather than opening a mail client. A recruiter who clicks "email" expects their mail client; getting a "copied to clipboard" toast is unexpected friction. **Use `mailto:` as the primary action, optionally with a copy button alongside.**

LinkedIn / GitHub / Instagram open in new tabs — fine. There is no contact form (acceptable for a portfolio — a `mailto:` link is enough).

The BTC wallet in the social rail (`index.vue:538`) is unusual. Fine if it's intentional flavor; it does signal an audience preference (crypto-curious) that may or may not match recruiter audiences.

### Trust signals

Good: dates on experience, links to verifiable Coursera credentials, redacted but real-looking score reports, custom domain, working external project links (`huggingface.co/derinaritter`, `tedxodtugvo.org`, etc.).

Missing: a photo (deliberate? makes it feel less personal), GitHub repo counts/stars, deployed-project metrics, any testimonial or third-party reference. The College Chronicle, MCMUN, TEDx — these are organizations with public footprints. One sentence ("read by 800 students" / "served 300 delegates") on each would tighten credibility a lot.

### Visual hierarchy

The H1 dominates correctly. Section H2s are intentionally small (`text-sm font-semibold uppercase`) — that's a stylistic choice from the Brittany Chiang template lineage. It works because the body copy carries weight. Where it breaks down: the company name (`text-lg font-semibold`) and the job title (`text-base font-medium`) are visually close — at a glance, "The College Chronicle" and "Co-Founder & Chief Technical Officer (CTO)" compete. Consider muting the title further (e.g. `text-slate-400`).

The italic Mos Def line on the left (`index.vue:54`) takes prime real estate that should hold the value prop.

### Mobile (≤380px)

Layout collapses cleanly — the sticky left rail becomes a normal stack. The pill nav (`index.vue:58-83`) wraps. Above-fold-on-mobile sequence:

1. Name (H1)
2. Empty H2 (whitespace)
3. Italic tagline
4. 4 pill buttons
5. BLOG / RESUME
6. 5 social icons
7. *(fold)* About starts

So a mobile visitor sees roughly the same thing as desktop — name + tagline + nav, no value prop. Same fix as above resolves both.

### Exit triggers

Most likely bounce points:
1. **Within 5s** — no value prop → "what does this person do?" → back button. Highest-volume exit.
2. **End of Credentials** — site abruptly ends with a footer copyright. No CTA, no "let's talk" hook. Add a one-line contact prompt at the bottom.
3. **Empty H2 visual stutter** — the gap between H1 and the italic line looks like a layout bug. Some visitors interpret broken layout as "this isn't finished, come back later" and leave.

### Top 5 highest-leverage retention changes

1. **Fill the empty H2 (`index.vue:42-47`) with a concrete value-prop sentence.** Single biggest win. Right now visitors don't know what you do without scrolling. Cost: 15 minutes. Impact: every visit.
2. **Replace "aspiring student" + "creative solutions" filler in About (`index.vue:225`) with concrete numbers from your work.** You already have the artifacts — 300-delegate MCMUN, fine-tuned Qwen3-4B, TEDx commission. Use them.
3. **Make the email link a real `mailto:` (`index.vue:544-552`).** Copy-to-clipboard on the primary contact method is friction for no benefit. Add a separate copy button if you like, but the default must be mailto.
4. **Quantify the Qwen3 project description (`index.vue:712-714`).** You have eval numbers. "Reduced inference latency 3.2× vs. Qwen3-7B at 94% accuracy" is the difference between "looks like a side project" and "this person can ship ML."
5. **Add a closing CTA after the Credentials section (currently `index.vue:411+` jumps to footer).** One line: "Currently considering university programs for fall 2026 — say hello: [mailto]." Gives visitors who scrolled to the bottom a reason to act.

---

## 2. Security Audit

### Secrets in repo

None found. `.gitignore` excludes `.env*`. No hardcoded API keys, no tokens. `wrangler.jsonc` has empty `vars: {}`. ✅

| Severity | Finding | Location | Fix |
|---|---|---|---|

### Missing security headers

**Severity: Medium.** `.output/public/_headers` only contains cache-control directives. None of the standard hardening headers are set.

**Location:** `.output/public/_headers` (build output; source would be a `public/_headers` you author, or a Nitro route rules block).

**Fix:** add a top block to `_headers` (or configure via `nitro.routeRules` so it survives rebuilds):

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Frame-Options: DENY
```

The CSP `script-src 'unsafe-inline'` is required because Nuxt injects an inline hydration payload — if you want stricter CSP, you'd need nonces via Nitro middleware. For a static portfolio, the above is the right tradeoff.

### Third-party scripts / supply chain

**Severity: Low.** The page itself loads **zero** external scripts. No Google Analytics, Plausible, fonts.googleapis, or chat widgets in `index.vue` or `app.vue`. Fonts appear to come from `@nuxt/ui` defaults bundled via `_fonts/*` (self-hosted). ✅

`@luxdamore/vue-cursor-fx` is a dependency in `package.json:13` but I see no usage in `app/` — the `<ClientOnly>` block at `index.vue:20-22` is empty. **Remove the dep**; it's dead weight and one more supply-chain surface.

### Contact form / endpoints

No server-side contact endpoint. Email goes via clipboard or (after the fix above) `mailto:`. Email address is harvestable as plaintext (`derinaritter@protonmail.ch`, also visible as a `tooltip` string at `index.vue:536`). **Tradeoff acceptable** — protonmail handles spam well; obfuscating the address would hurt UX more than it helps deliverability for a public portfolio.

### PII exposure

| Item | Risk | Verdict |
|---|---|---|
| Real name, school name, city | Doxxable, but intentional for a portfolio | Acceptable |
| Personal email | Public on purpose | Acceptable |
| BTC wallet `bc1q…` (`index.vue:538`) | Pubkey, by design | Acceptable — but consider whether broadcasting a wallet adds or subtracts from your target audience |
| Redacted SAT/IELTS scans | Already redacted | ✅ — but **double-check the redacted JPGs don't leak metadata** (see below) |

**Severity: Low–Medium — verify EXIF on `public/credentials/*.jpg`.** Run:
```
exiftool public/credentials/redacted_sat.jpg public/credentials/redacted_ielts.jpg
```
If the redaction was done in a tool that preserves the original-image preview (some PDF/image redaction tools leave the unredacted version in metadata or as an embedded thumbnail), the raw scan may still be recoverable. If exiftool shows GPS, full name fields, or `PreviewImage`/`ThumbnailImage`, strip with `exiftool -all=` and re-deploy.

### XSS surface

**Severity: None found.** Grepped `app/` for `innerHTML`, `v-html`, `dangerouslySet` — zero matches. All dynamic content is bound via `{{ }}` (escaped). No URL-param-driven rendering. ✅

### Dependency posture

`package.json`:
- `nuxt ^4.1.2`, `vue ^3.5.22`, `@nuxt/ui ^4.0.1` — current.
- `p5 ^1.9.4` — used only by the A* page. **Should be code-split** (Nuxt does this per-page automatically via dynamic imports; verify the main route bundle doesn't include p5 — see Performance section).
- `@luxdamore/vue-cursor-fx ^1.6.2` — appears unused. Remove.
- `@nuxthub/core ^0.9.1` — listed but I don't see it imported in `nuxt.config.ts`. If unused, remove.
- No Node version pin in `package.json` (`engines` block missing). Add `"engines": {"node": ">=20"}` or pin via `.nvmrc`.

No deprecated/CVE-flagged packages spotted in the visible deps. Run `pnpm audit` periodically — I didn't execute it.

### Open redirects / mixed content / link hygiene

External anchors consistently use `rel="noreferrer noopener"` (`index.vue:134`, `144`, `335`, `429`). ✅

One issue: `index.vue:332-339` has a `<a target="_blank" rel="noreferrer noopener">` with no `href` — it relies on the parent `<motion.article>` click handler to navigate. This is mostly cosmetic but it breaks keyboard navigation (the link can't be focused/activated) and middle-click "open in new tab". Either give the `<a>` a real `:href="project.href"` and drop the article click handler, or replace the `<a>` with a `<span>`.

### Auth / admin surfaces

None. Static-ish site. No `/admin`, no exposed `.git` (relies on Cloudflare not serving dotfiles — verified by absence in `.output/public/`). No `.map` files in `.output/public/_nuxt/` (good — no source maps in production). ✅

### Domain / email hygiene

Out-of-scope from repo alone — can't verify SPF/DKIM/DMARC for `derinaritter.com`. If you send any mail from this domain (e.g. via Cloudflare Email Routing forwarders), add SPF and DMARC records. Protonmail's own DKIM doesn't help if mail is forwarded from `@derinaritter.com`.

### Deploy script hygiene

**Severity: Medium.** `deploy.sh`:

- Line 1: `sudo chown -R $(whoami) .` — **why is sudo here?** This suggests a previous permission incident; running it on every deploy is a smell. If your repo somehow ends up root-owned, fix that root cause once; don't chown on every deploy. (Also: if you ever copy this script into a CI runner, `sudo` will either fail or do something unintended.)
- `git add .` — adds *everything* untracked. If you ever drop a `.env` or a `secrets.json` into the repo, this commits it. Stage explicit paths or rely on `.gitignore` discipline; in either case, consider `git add -A app/ public/ nuxt.config.ts ...` or pre-commit hooks.

### Summary table

| Severity | Finding | Location | Fix |
|---|---|---|---|
| Med | No security headers (CSP, HSTS, X-CTO, Referrer-Policy, Permissions-Policy, X-Frame-Options) | `.output/public/_headers` | Add `/* …` block per snippet above; commit a `public/_headers` source file |
| Med | EXIF / embedded preview in credential scans may leak unredacted image | `public/credentials/*.jpg` | Run `exiftool -all=` to strip; re-check with `exiftool` |
| Med | `deploy.sh` uses `sudo chown` + `git add .` | `deploy.sh:1-7` | Drop the chown, stage paths explicitly |
| Low | Unused/zombie dependency `@luxdamore/vue-cursor-fx` (+ empty `<ClientOnly>`) | `package.json:13`, `index.vue:20-22` | `pnpm remove @luxdamore/vue-cursor-fx`, delete the empty `<ClientOnly>` |
| Low | Possibly unused `@nuxthub/core` | `package.json` | If not used, remove |
| Low | `<a target="_blank">` with no `href` breaks keyboard + middle-click | `index.vue:332-339` | Set `:href` on the anchor or change to `<span>` |
| Low | No Node version pin | `package.json` | Add `"engines": {"node": ">=20"}` |
| Low | Email plaintext-harvestable (acceptable tradeoff) | `index.vue:536` | No action — flagged for awareness |

---

## 3. Performance Audit

### JS payload — biggest issue

Built bundle in `.output/public/_nuxt/`:

```
Dn_OymKM.js    1.0M   ← shared/vendor chunk
DXYC1pzb.js    204K
DT3IPci4.js     28K
+ a few smaller chunks
total          1.6M (un-gzipped)
```

**1 MB un-gzipped JS for a one-pager is heavy.** Likely culprits, in order: `motion-v` (used liberally throughout `index.vue`), `@nuxt/ui` (full component lib with icons), `p5` (only needed on `/astar` — if it's in the main vendor chunk, the index page is shipping it for no reason).

**Verify** with:
```
pnpm exec nuxt analyze
```
This builds with a bundle analyzer. Look for: (a) is `p5` in the main chunk or only in the astar route chunk? (b) what's `motion-v`'s weight? (c) are unused `@nuxt/ui` components tree-shaken?

**Mitigations:**
- If `motion-v` is bulky, replace the *page-transition* `motion.h2`/`motion.p` decoration on every paragraph with plain CSS `@starting-style` or a single intersection observer + Tailwind transitions. Most of the 30+ `motion.*` wrappers in `index.vue` do nothing the browser can't do cheaper.
- Use `defineAsyncComponent` for the credential preview modal (`index.vue:435-476`) — it's only needed when a user clicks "View credential".
- The `p5` dep should only ship on `/astar` — Nuxt does this per-page; verify with `nuxt analyze`.

### Asset weight

| File | Size | Format | Notes |
|---|---|---|---|
| `public/credentials/redacted_sat.jpg` | 285 KB | JPEG | Loaded only on modal open ✅, but could be ~80 KB as WebP |
| `public/credentials/redacted_ielts.jpg` | 274 KB | JPEG | Same |
| `public/signature_derin.png` | 80 KB | PNG | Used in CSS mask (`main.css`) AND `<NuxtImg>` (`index.vue:412-418`) — loaded twice in different forms. Consider converting to inline SVG (signatures vectorize well) — would drop to ~5 KB and scale crisply |
| `public/favicon.ico` | 15 KB | ICO | Acceptable |

You have `@nuxt/image` installed (`package.json`) but the `<NuxtImg>` usages don't specify `width`/`height`/`format`. Add `format="webp"` and explicit dimensions to enable automatic transforms and prevent CLS.

### Fonts

No custom fonts imported in `main.css`; relies on `@nuxt/ui` defaults (which self-hosts Inter via `/_fonts/*`). The `_headers` file caches `_fonts/*` immutably for a year ✅. Confirm `font-display: swap` — `@nuxt/ui` v4 sets this by default but worth verifying in DevTools.

### CSS

Tailwind v4 + `@nuxt/ui` — `@nuxt/ui` ships its own component CSS, which is pre-purged. Tailwind v4's JIT removes unused selectors. CSS chunks in `.output/public/_nuxt/*.css` look reasonable. No action needed.

### Render path

`index.vue` has no `<script src>` in its template, so no manual render-blocking scripts. Nuxt's own entry script is module-type (async). The hydration payload is inline (required for SSR/SSG handoff).

**`useHead` at `index.vue:488-490` sets only `title`.** Missing:
- `<meta name="description">` — hurts SEO + social sharing
- `<meta property="og:title|description|image">` — link previews on Twitter, LinkedIn, iMessage all show nothing useful right now
- `<link rel="canonical">`
- `<meta name="viewport">` — Nuxt sets this by default ✅

Add an OG image (a static `public/og.png`, 1200×630, with name + tagline) — this is the single highest-leverage SEO change you can make. Without it, every shared link looks anonymous.

### Caching & CDN

`_headers` correctly marks `/_nuxt/*`, `/_fonts/*` as `max-age=31536000, immutable`. Page HTML isn't cached aggressively, which is correct for a Worker rendering dynamic content. ✅

No cache rule for `/credentials/*` or `/signature_derin.png`. Add:
```
/credentials/*
  cache-control: public, max-age=2592000
/*.png
  cache-control: public, max-age=2592000
```

### Layout shift sources

- `<NuxtImg>` at `index.vue:412-418` (signature in footer) has no `width`/`height` → CLS when it loads. Set explicit dimensions (e.g. `:width="200" :height="56"` matching its rendered ~`h-14`).
- The credential preview `<NuxtImg>` at `index.vue:465-471` is inside a modal so doesn't affect main-page CLS.
- The 30+ `motion.*` `whileInView` animations don't *cause* CLS (they animate `opacity` and `y`), but they do trigger many `getBoundingClientRect`/intersection observers — measurable jank on lower-end devices.

### LCP candidate

LCP is almost certainly the H1 "Derin Alan Ritter" text block (`index.vue:29-41`). Text-based, no preload needed, paints fast ✅. The `motion.h1` `initial: { opacity: 0 }` means the LCP element starts invisible and fades in over 0.8s — **this delays LCP by ~800ms unnecessarily.** Remove the entry animation on the H1 (keep it on secondary elements), or set `initial: { opacity: 1 }` for first paint.

### Accessibility / SEO calls

- **Empty H2** (`index.vue:42-47`) — broken heading order at the page level. Either fill it (recommended for the value prop) or change the element.
- `useHead` lacks meta description — see above.
- All section H2s exist and are properly nested under H1. ✅
- `aria-label` on social `<ul>` ✅, `sr-only` labels on icon links ✅.
- The empty `<ClientOnly>` block at `index.vue:20-22` is harmless but dead — delete it.
- Project article cards (`index.vue:316-340`) are clickable `<motion.article>` with no `role="link"` and no keyboard handler — only mouse users can open them. The inner `<a>` would have made them keyboard-accessible if it had an `href` (see Security finding above).

---

## Prioritized punch list — ship in this order

Ranked by impact-to-effort. The top 5 are 30-minute jobs each; the rest are afternoon-or-less.

1. **Fill the empty H2 with a value prop.** `app/pages/index.vue:42-47`. Biggest single win on the site. *5 minutes.*
2. **Add OG meta tags + OG image.** Update `useHead` at `index.vue:488-490` with `description`, `og:title`, `og:description`, `og:image`. Drop a `public/og.png` (1200×630). Every link you ever paste anywhere benefits. *30 minutes.*
3. **Make the email link a real `mailto:`.** `index.vue:533-562`. Remove the clipboard-copy magic for email; keep it for the BTC address. *10 minutes.*
4. **Add the security headers block to `_headers`.** See snippet in Security section. Strip headers leak nothing about you, set a CSP appropriate for a static-ish site. *15 minutes.*
5. **Remove the H1 fade-in (`initial: { opacity: 0 }`) at `index.vue:29-41`.** LCP improvement is essentially free. *2 minutes.*
6. **Quantify three vague claims.** Specifically: the Qwen3 description (`index.vue:712-714`), the AprilTag claim (`index.vue:641`), and the College Chronicle summary (`index.vue:606`). One number each. *30 minutes if you know the numbers.*
7. **Rewrite About paragraph 1 (`index.vue:225`).** Drop "aspiring student", "creative solutions", "unique constraints". Lead with concrete role + one artifact. *15 minutes.*
8. **Drop unused deps: `@luxdamore/vue-cursor-fx`, possibly `@nuxthub/core`.** Delete empty `<ClientOnly>` at `index.vue:20-22`. *5 minutes.*
9. **Run `pnpm exec nuxt analyze`** to confirm `p5` is in the astar-only chunk, then trim the heaviest `motion-v` decorations (the section-level fade-ins on every `<p>` and `<h2>` are pure visual sugar — keeping one per section is plenty). *1-2 hours.*
10. **Strip EXIF from credential JPGs and convert to WebP.** `exiftool -all= public/credentials/*.jpg` then convert. Drops both files by ~3× and closes the metadata leak risk. *15 minutes.*

---

## Questions I need from you before going further

1. **Is the empty `<h2>` at `index.vue:42-47` intentional** (e.g. you were planning to leave it blank as a design choice) or a leftover from an in-progress edit? My recommendation assumes it's an oversight — confirm before I'd advise rewriting the hero.
2. **Audience priority.** Is this primarily for university admissions, internships/jobs, or for collaborators/clients of your own work (RK Media, etc.)? The "lead with a value prop" rewrite differs by audience — admissions wants narrative; recruiters want titles + numbers; clients want outcomes + portfolio breadth.
3. **The BTC wallet** in the social rail — intentional flavor, or leftover? I'd remove it for an admissions/recruiter audience and keep it if your audience is web3-adjacent.
