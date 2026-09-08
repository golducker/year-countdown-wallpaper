# Year Countdown Wallpaper

A minimalist iPhone lock-screen wallpaper that counts down the days left in the current year.
Elapsed days fill a 365-dot grid, today glows, and the day count, percentage, date and an
editable message sit around it. Pure black (OLED), warm-amber accent. Layout reviewed against
Apple's Human Interface Guidelines and sized for iPhone 13 (1170 &times; 2532).

Inspired by [thelifecalendar.com](https://thelifecalendar.com) &mdash; this is an independent
clone you fully control.

## Live

| Page | URL |
| --- | --- |
| Wallpaper (screenshot this) | <https://year-countdown-wallpaper.vercel.app/> |
| iPhone-frame preview | <https://year-countdown-wallpaper.vercel.app/preview> |

Everything is computed from the device clock at page load, so a fresh screenshot each morning is
always current. No backend, no build step.

## Put it on your iPhone (auto-updating)

**1. Shortcut** (this exact order — it guarantees a fresh render every day)

1. **Current Date**
2. **Format Date** &rarr; Date Format: *Custom*, format string `yyyy-MM-dd`
3. **Text**:
   `https://image.thum.io/get/width/1170/crop/2532/noanimate/https://year-countdown-wallpaper.vercel.app/?date=`
   then tap the end and insert the **Formatted Date** variable from step 2
4. **Get Contents of URL** &rarr; input: the **Text** from step 3
5. **Set Wallpaper** &rarr; Lock Screen, turn off *Show Preview*

Why the date in the URL: it makes each day's URL unique, so thum.io can never serve
yesterday's cached image, and the page counts down from *your phone's* local date rather
than the render server's clock. A minimal version without the date
(`.../noanimate/maxAge/1/https://year-countdown-wallpaper.vercel.app/`) also works but can
lag by a day across time zones.

**2. Automation**

- Shortcuts &rarr; Automation tab &rarr; **+** &rarr; **Time of Day** &rarr; 6:00 AM, Daily
- **Run Immediately**, turn off *Notify When Run*
- Run the shortcut from step 1

`thum.io` renders the page in a headless browser and returns a PNG (free, no API key). It sees
the page URL and the quote text, nothing else. For a fully private setup, render the PNG on
your own machine on a schedule and sync it to a Photos album the automation reads from.

## Customize

Edit [`index.html`](index.html):

- **Quote** &mdash; the string after `YOUR QUOTE` in the `<script>`
- **Accent** &mdash; `--accent` in `:root`

Or override per request with query params (no edit needed):

- `?msg=Ship%20it`
- `?accent=%23ff5500`
- `?date=2026-12-25` &mdash; render any day, for testing

## Develop

Static site, no build. Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

`preview.html` embeds the live `index.html` in an iPhone frame with the iOS lock screen drawn
on top &mdash; use it to sanity-check layout changes.

## Deploy

Hosted on Vercel. Pushes to `main` deploy automatically. `vercel.json` enables `cleanUrls`
(so `/preview` works) and sends a no-cache header so each render is fresh.

---

Built with [Claude Code](https://claude.com/claude-code).
