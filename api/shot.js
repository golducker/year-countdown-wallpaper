// GET /shot                 -> today's wallpaper (date resolved server-side)
// GET /shot/YYYY-MM-DD      -> a specific day
// GET /shot?tz=Europe/Paris -> today in another time zone
// GET /shot?force=1         -> bypass the render cache
//
// Redirects to a microlink render of the page at a real iPhone 13 viewport
// (390x844 pt @3x => exactly 1170x2532 px).
//
// Design note — this endpoint exists to keep the phone-facing URL trivial.
// Two things broke when the Shortcut had to build the URL itself:
//   1. iOS Shortcuts absorbed everything after the first "&" of the full
//      microlink URL into its url= value, so microlink returned JSON
//      metadata and Set Wallpaper painted a wall of text.
//   2. Appending a date variable to ".../shot/" lost the trailing slash,
//      producing "/shot2026-09-08" and a 404.
// Hence: no query string, no "&", and no variable to append. "/shot" alone
// is enough, because the date is resolved here.
//
// The redirect is deliberate: the phone fetches the image from microlink
// directly, on its own IP, rather than through Vercel's shared egress.

const SITE = 'https://year-countdown-wallpaper.vercel.app/';
const DEFAULT_TZ = 'Asia/Ho_Chi_Minh';

// en-CA formats as YYYY-MM-DD, which is what the page expects.
function todayIn(tz) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function handler(req, res) {
  const raw = req.query.date;
  let date = typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;

  if (!date) {
    const tz = typeof req.query.tz === 'string' && req.query.tz ? req.query.tz : DEFAULT_TZ;
    try {
      date = todayIn(tz);
    } catch {
      date = todayIn('UTC'); // unknown time zone string
    }
  }

  // The page reads ?date= so the countdown follows this date, not the
  // render server's clock.
  const target = `${SITE}?date=${date}`;

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

  res.setHeader('Cache-Control', 'no-store');
  res.redirect(302, api);
}
