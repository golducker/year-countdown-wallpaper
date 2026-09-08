// GET /shot/YYYY-MM-DD  (rewritten here by vercel.json)
//
// Redirects to a microlink render of the wallpaper at a real iPhone 13
// viewport (390x844 pt @3x => exactly 1170x2532 px).
//
// Why this exists: the full microlink URL needs several "&" parameters, and
// iOS Shortcuts mangles those when you build the string in a Text action —
// everything after the first "&" gets absorbed into the url= value and you
// get JSON back instead of an image. Keeping the phone-facing URL to a plain
// path with no query string and no "&" avoids that entirely.
//
// This issues a redirect rather than proxying the bytes, so the phone fetches
// from microlink directly (its own IP, its own rate-limit budget) instead of
// going through Vercel's shared egress addresses.

const SITE = 'https://year-countdown-wallpaper.vercel.app/';

export default function handler(req, res) {
  const raw = req.query.date;
  const date = typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;

  // The page reads ?date= so the countdown follows the phone's timezone
  // rather than the render server's clock.
  const target = date ? `${SITE}?date=${date}` : SITE;

  const api =
    'https://api.microlink.io/?url=' + encodeURIComponent(target) +
    '&screenshot=true' +
    '&meta=false' +
    '&embed=screenshot.url' +
    '&viewport.width=390' +
    '&viewport.height=844' +
    '&viewport.deviceScaleFactor=3' +
    '&screenshot.type=png' +
    (req.query.force !== undefined ? '&force=true' : '');

  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.redirect(302, api);
}
