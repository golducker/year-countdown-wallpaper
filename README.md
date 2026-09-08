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
| Wallpaper (screenshot this) | `https://<your-domain>/` |
| iPhone-frame preview | `https://<your-domain>/preview` |

Everything is computed from the device clock at page load, so a fresh screenshot each morning is
always current. No backend, no build step.

## Put it on your iPhone (auto-updating)

**1. Shortcut**

- Shortcuts app &rarr; new shortcut
- **Get Contents of URL**:
  `https://image.thum.io/get/width/1170/crop/2532/noanimate/https://<your-domain>/`
- **Set Wallpaper** &rarr; Lock Screen, turn off *Show Preview*

**2. Automation**

- Shortcuts &rarr; Automation tab &rarr; **+** &rarr; **Time of Day** &rarr; 6:00 AM, Daily
- **Run Immediately**, turn off *Notify When Run*
- Run the shortcut from step 1

`thum.io` renders the page in a headless browser and returns a PNG (free, no API key). It sees
the page URL and the message text, nothing else. For a fully private setup, render the PNG on
your own machine on a schedule and sync it to a Photos album the automation reads from.

## Customize

Edit [`index.html`](index.html):

- **Message** &mdash; the string after `YOUR MESSAGE` in the `<script>`
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
