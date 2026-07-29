---
name: site-visual-check
description: Screenshot and visually verify site/ (claudinite.com), desktop and mobile, and deliver the result to the owner. Use when changing site/ markup, CSS, or animations, or when checking responsive/mobile rendering.
---

The site is static and dependency-free, so verification is: serve `site/`, render it
in a real browser, look at the image. Do that on **every** change to `site/` — the
page is iterated frequently and unreviewed.

## Serve it

```
(python3 -m http.server 8321 -d site >/dev/null 2>&1 &) && sleep 1
```

Kill the server once the last shot is taken; don't leave it running for the rest
of the session.

## Desktop shots

`chrome --headless --screenshot` is fine **for desktop widths**:

```
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --disable-gpu \
  --no-sandbox --window-size=1440,8400 --virtual-time-budget=8000 \
  --hide-scrollbars --screenshot=$SP/full.png "http://localhost:8321/"
```

`--virtual-time-budget` must outlast the reveal-on-scroll and mechanism
animations, or sections render mid-transition and look broken when they aren't.
A full-page PNG is too tall to read in one go — crop it into sections with
Pillow before viewing.

## Mobile — do NOT use `--window-size` to fake a phone viewport

**Footgun, and it costs a whole phantom bug hunt.** A narrow
`--window-size=390,9500` headless shot renders the page at a *clamped* width and
crops content at the right edge. That looks exactly like a horizontal-overflow
bug across every section, and it is not one — the layout is fine at a real 390px
viewport. Don't start instrumenting CSS to find the "offender."

For any width below desktop, drive a real browser context instead:

```js
import { chromium } from 'playwright-core';  // npm i playwright-core in scratch
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const p = await b.newPage({ viewport: { width: 390, height: 844 },
                            deviceScaleFactor: 2 });
await p.goto('http://localhost:8321/', { waitUntil: 'networkidle' });
await p.screenshot({ path: 'mobile.png', fullPage: true });
await b.close();
```

`newContext`/`newPage` with an explicit `viewport` is what actually applies the
media queries; the CLI flag does not.

## Show the owner

A raw full-page capture is rejected as too large — downscale to roughly 600–720px
wide and send it as JPEG (quality ~82), alongside a full-size hero crop.
