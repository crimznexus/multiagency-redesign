/**
 * Captures the live project sites shown in "Selected work" and writes
 * responsive AVIF + WebP files to public/work/.
 *
 *   npm run capture:work
 *
 * The images are committed, so builds never depend on third-party sites
 * being up. Re-run when a project's site changes.
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const SITES = [
  { id: 'ping', url: 'https://onramp.pingpay.io' },
  { id: 'nearbuilders', url: 'https://nearbuilders.org' },
]
const VIEWPORT = { width: 1200, height: 750 } // 16:10, matches the frame
const WIDTHS = [640, 1200]
const OUT = fileURLToPath(new URL('../public/work/', import.meta.url))

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()

for (const site of SITES) {
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
