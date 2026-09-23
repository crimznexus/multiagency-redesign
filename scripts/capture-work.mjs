/**
 * Captures the live project sites shown in "Our work" and writes
 * responsive AVIF + WebP files to public/work/.
 *
 *   npm run capture:work                 # every site
 *   npm run capture:work -- city-nodes   # only the ids given
 *
 * Projects without a public site get an illustration instead: an HTML page
 * in scripts/illustrations/, set in the site's own tokens, rendered the same
 * way. Placeholder bars stand in for copy, so nothing reads as a real post.
 *
 * The images are committed, so builds never depend on third-party sites
 * being up. Re-run when a project's site changes.
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const illustration = (name) => new URL(`./illustrations/${name}.html`, import.meta.url).href

const SITES = [
  { id: 'ping', url: 'https://onramp.pingpay.io' },
  { id: 'city-nodes', url: 'https://citynode.app' },
  { id: 'nearbuilders', url: 'https://nearbuilders.org' },
  { id: 'near-builders-social', url: illustration('near-builders-social') },
  { id: 'near-builders-bot', url: illustration('near-builders-bot') },
]
const only = process.argv.slice(2)
const VIEWPORT = { width: 1200, height: 750 } // 16:10, matches the frame
const WIDTHS = [640, 1200]
const OUT = fileURLToPath(new URL('../public/work/', import.meta.url))

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()

for (const site of SITES.filter((s) => only.length === 0 || only.includes(s.id))) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2, colorScheme: 'light' })
  await page.goto(site.url, { waitUntil: 'networkidle', timeout: 45_000 })
  await page.waitForTimeout(1500) // let entrance animations settle
  const png = await page.screenshot({ type: 'png' })
  await page.close()

  for (const width of WIDTHS) {
    const base = sharp(png).resize({ width })
    await base
      .clone()
      .avif({ quality: 55, effort: 6 })
      .toFile(join(OUT, `${site.id}-${width}.avif`))
    await base
      .clone()
      .webp({ quality: 78 })
      .toFile(join(OUT, `${site.id}-${width}.webp`))
  }
  console.log(`✓ ${site.id}`)
}

await browser.close()
