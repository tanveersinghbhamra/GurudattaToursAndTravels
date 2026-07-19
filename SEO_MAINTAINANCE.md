# SEO Maintenance Guide

Keep this open whenever you're editing `index.html`. It's organized by *what
you're changing* — find your situation below, follow the steps, move on.
None of this is complicated; it's just easy to forget one small piece (like
the FAQ schema drifting out of sync with the visible FAQ) and quietly lose
the SEO value without noticing.

---

## 1. Changing text / copy

- **Keep location and service words in naturally**, especially in headings
  and the first sentence of a section — "Nashik", "Maharashtra", "cab",
  "taxi", "tours and travels". Don't force them in awkwardly; Google
  penalizes stuffing, and it reads badly too. One natural mention per
  section beats five forced ones.
- **Don't remove or renumber headings** without thinking about it — there
  should always be exactly **one `<h1>`** on the page (currently the hero
  headline). Everything else should be `<h2>` for section titles and `<h3>`
  for anything nested inside a section (card titles, step titles, etc.).
  Search for `<h1` in the file — if you ever see it twice, fix it.
- **If you change a phone number, address, or business name**, change it
  everywhere at once:
  - Visible text (header, footer, CTA section)
  - The `TaxiService` structured data block in `<head>` (`telephone`,
    `address`)
  - `tel:` and `wa.me` links (search for `919011712399`)
  Inconsistent contact info across the page (or across the internet — see
  the README's "NAP consistency" note) actively hurts local search ranking.

## 2. Adding/editing FAQ questions

The FAQ has two copies that **must match**: the visible accordion in the
body, and the `FAQPage` JSON-LD block in `<head>`. If you add a question to
one, add it to the other, word-for-word in the answer. Mismatched structured
data can get the rich result disabled entirely.

Good candidates for new FAQ entries: any question a customer actually asks
you on a call or WhatsApp that isn't already answered. Real questions =
real search queries.

## 3. Adding new photos

- Use `loading="lazy"` on every `<img>` that isn't the very first thing
  visible on the page (the hero background is the only exception — that one
  should stay eager/preloaded since it's the first thing visitors see).
- Write **descriptive, natural `alt` text** — describe what's actually in
  the photo. "Innova Crysta parked outside Trimbakeshwar temple" is good.
  "Nashik cab taxi tours travels booking Innova" is keyword-stuffed and
  Google's guidelines explicitly flag this as poor quality.
- Compress before uploading. Aim under ~300KB per photo where possible —
  page speed is a ranking factor, and a slow site loses visitors before
  they even see your content. Unsplash/TinyPNG-style compression, or export
  at 80–85% quality, is usually enough.

## 4. Adding a new route, city, or service

This is the highest-value kind of edit for your SEO goal (showing up for
every relevant search). When you add one, touch all four of these:

1. **The "Where We Drive" section** (`id="areas"`) — add the city/town as
   a new `<span>` chip.
2. **The `TaxiService` structured data** in `<head>` — add it to the
   `areaServed` array, and if it's a new *service* (not just a city) add it
   to `hasOfferCatalog`.
3. **The Routes mosaic or footer links**, if it's popular enough to deserve
   its own visible route card (e.g. "Nashik to Kolhapur Cab").
4. **A matching FAQ entry**, if it's a common enough question ("Do you go
   to X?").

## 5. Adding a whole new section

- Give it a proper `id` and use it as the anchor target if you link to it
  from the nav or footer (descriptive text, not "click here").
- Match the existing spacing rhythm: sections use `padding:120px 0` by
  default (see `css/style.css`), separated by the small dot-line "milestone"
  dividers between differently-purposed sections. Check the current file for
  an example before inventing new spacing values — consistency here is a
  design and UX thing as much as SEO.
- If it introduces new keywords worth targeting, add or update the
  `<meta name="description">` and `<title>` only if the *page's core focus*
  changes — don't rewrite these for every small addition, they should stay
  stable unless the primary value proposition changes.

## 6. Before you publish any batch of changes

Quick self-check, takes two minutes:

- [ ] Still exactly one `<h1>` on the page
- [ ] Every new `<img>` has real `alt` text
- [ ] FAQ visible list and FAQ schema still match
- [ ] Phone/address consistent everywhere if changed
- [ ] `sitemap.xml` `<lastmod>` date updated
- [ ] Test structured data at
      [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
      — paste the live URL once deployed, confirm no errors
- [ ] Quick mobile check — resize the browser or use dev tools' device
      toolbar, scroll the whole page once

## 7. Ongoing (monthly-ish)

- Check Google Search Console for new queries you're appearing for but not
  yet targeting explicitly — those are free ideas for new FAQ entries or
  route pages.
- Add 1–2 new real Google reviews' worth of social proof if you have them
  (testimonials section).
- Confirm NAP (name/address/phone) is still identical across your Google
  Business Profile, website, and any directory listings.

---

## How we'll work together on this

Two ways, whichever's easier for you as you go:

1. **You make the change, I audit it.** Paste me the updated section or
   describe what you changed, and I'll check it against this list and fix
   anything that slipped.
2. **You tell me what changed (new photos, new route, new pricing, etc.)
   and I make the edit** directly across all the files it touches (HTML,
   structured data, sitemap) in one pass, so nothing gets missed.

Either way, keep this file updated if we establish any new pattern — it's
meant to grow with the site, not be a one-time document.