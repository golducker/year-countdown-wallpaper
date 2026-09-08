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

**1. Shortcut** (this exact order — it guarantees a sharp, fresh render every day)

1. **Current Date**
2. **Format Date** &rarr; Date Format: *Custom*, format string `yyyy-MM-dd`
3. **Text** &mdash; paste this, then insert the **Formatted Date** variable right at the end
   (no space, nothing after it):

   `https://year-countdown-wallpaper.vercel.app/shot/`
4. **Get Contents of URL** &rarr; input: the **Text** from step 3
5. **Set Wallpaper** &rarr; Lock Screen, turn off *Show Preview*

The finished URL looks like `https://year-countdown-wallpaper.vercel.app/shot/2026-09-08`.
To bypass the render cache immediately (e.g. right after editing the quote), open
`.../shot/2026-09-08?force=1` once in a browser.

**2. Automation**

- Shortcuts &rarr; Automation tab &rarr; **+** &rarr; **Time of Day** &rarr; 6:00 AM, Daily
- **Run Immediately**, turn off *Notify When Run*
- Run the shortcut from step 1

### How `/shot/<date>` works, and why it exists

[`api/shot.js`](api/shot.js) takes a plain date path and 302-redirects to a `microlink` render
of the page at a real iPhone 13 viewport (390&times;844 pt at `deviceScaleFactor=3`), which
returns an exact **1170&times;2532** PNG &mdash; pixel-for-pixel with the screen, no rescaling.

Two problems it solves:

- **`thum.io` cannot produce a portrait image.** `crop/{height}` does not set height; every
  combination returns a square (`width/1170/crop/2532` &rarr; 1170&times;1170). iOS then
  upscaled and cropped that square to fill the screen, which is why it looked soft and
  off-centre.
- **iOS Shortcuts mangles `&` in a hand-built URL.** Given the full microlink URL, Shortcuts
  absorbed everything after the first `&` into the `url=` value, so microlink returned JSON
  metadata and Set Wallpaper painted a wall of text. A plain path with no query string and no
  `&` removes that failure mode entirely.

The date in the path does two jobs: each day is a unique URL so no cached image can be reused,
and the countdown is pinned to *your phone's* date rather than the render server's clock
(which is several hours off in most time zones).

The redirect is deliberate &mdash; your phone fetches the image from microlink directly, on its
own IP, instead of routing through Vercel's shared egress addresses.

Privacy: microlink fetches the page URL and renders it. It sees the URL and the quote text,
nothing else. For a fully private setup, render the PNG on your own machine on a schedule and
sync it to a Photos album the automation reads from.

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
