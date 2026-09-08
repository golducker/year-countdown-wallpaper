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

**1. Shortcut** &mdash; two actions, one fixed URL, no variables:

1. **Get Contents of URL**:

   `https://year-countdown-wallpaper.vercel.app/shot`
2. **Set Wallpaper** &rarr; Lock Screen, turn off *Show Preview*

That's the whole thing. `/shot` resolves today's date on the server, so there is nothing for
the Shortcut to build and nothing to get wrong.

To bypass the render cache immediately (e.g. right after editing the quote), open
`.../shot?force=1` once in a browser.

**2. Automation**

- Shortcuts &rarr; Automation tab &rarr; **+** &rarr; **Time of Day** &rarr; 6:00 AM, Daily
- **Run Immediately**, turn off *Notify When Run*
- Run the shortcut from step 1

### How `/shot` works, and why it exists

[`api/shot.js`](api/shot.js) resolves today's date, then 302-redirects to a `microlink` render
of the page at a real iPhone 13 viewport (390&times;844 pt at `deviceScaleFactor=3`), which
returns an exact **1170&times;2532** PNG &mdash; pixel-for-pixel with the screen, no rescaling.

| Route | Result |
| --- | --- |
| `/shot` | today, in `Asia/Ho_Chi_Minh` |
| `/shot?tz=Europe/Paris` | today, in another time zone |
| `/shot/2026-12-25` | a specific day |
| `/shot?force=1` | bypass the render cache |

It exists because everything simpler than this broke:

- **`thum.io` cannot produce a portrait image.** `crop/{height}` does not set height; every
  combination returns a square (`width/1170/crop/2532` &rarr; 1170&times;1170). iOS upscaled
  and cropped that square to fill the screen &mdash; soft, and off-centre.
- **iOS Shortcuts mangles `&` in a hand-built URL.** Given the full microlink URL, Shortcuts
  absorbed everything after the first `&` into the `url=` value; microlink returned JSON
  metadata and Set Wallpaper painted a wall of text.
- **Appending a date variable lost the trailing slash**, producing `/shot2026-09-08` &rarr; a
  404 page, painted as the wallpaper. (A rewrite now catches that form too, but the date is no
  longer needed at all.)

Resolving the date server-side also keeps the countdown on *your* calendar day rather than the
render server's clock, and makes each day's microlink URL unique so no cached image is reused.

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
