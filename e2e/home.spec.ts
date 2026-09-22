import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

test('home renders the headline', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The AI-native agency that shows its work.')
})

test('home has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

test('no horizontal overflow on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('the only thing that loops is the live-dot ping', async ({ page }) => {
  await page.goto('/')
  const names = await page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName))
  expect(names.every((n) => n === 'ping')).toBe(true)
})

test.describe('project console', () => {
  test('tabs switch with the keyboard and re-route the pipeline', async ({ page }) => {
    await page.goto('/')
    const tabs = page.getByRole('tablist', { name: 'Choose a kind of project' }).getByRole('tab')
    await expect(tabs).toHaveCount(4)
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    const panel = page.getByRole('tabpanel')
    await expect(panel).toHaveAccessibleName(/Bots & automation/)
    await expect(panel.getByText('Conversation flows, tool integrations, reply drafts.')).toBeVisible()
  })

  test('exactly one of six steps is done by AI', async ({ page }) => {
    await page.goto('/')
    const panel = page.getByRole('tabpanel')
    await expect(panel.getByRole('listitem')).toHaveCount(6)
    await expect(panel.getByText('AI', { exact: true })).toHaveCount(1)
  })
})

test('the comparison is a real table on desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'phones get one card per row')
  await page.goto('/')
  const table = page.getByRole('table', { name: /How MultiAgency compares/ })
  await expect(table.getByRole('columnheader')).toHaveText(['A typical agency', 'AI tools alone', 'MultiAgency'])
  await expect(table.getByRole('rowheader')).toHaveCount(5)
})

test('four services, each linking to real work on the page', async ({ page }) => {
  await page.goto('/')
  const section = page.getByRole('region', { name: 'What you can hire us for' })
  await expect(section.getByRole('heading', { level: 3 })).toHaveText([
    'Product & web',
    'Bots & automation',
    'Content & video',
    'Social & community',
  ])
  const hrefs = await section.locator('a[href^="#work-"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  expect(hrefs.length).toBeGreaterThanOrEqual(4)
  for (const href of new Set(hrefs)) await expect(page.locator(href as string)).toHaveCount(1)
})

test.describe('work', () => {
  test('featured projects, safe external links, reserved image sizes', async ({ page }) => {
    await page.goto('/')
    const work = page.getByRole('region', { name: 'Shipped, live, and on the record' })
    await expect(work.getByRole('heading', { level: 3 }).first()).toHaveText('Ping')
    for (const link of await work.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
    for (const img of await work.locator('img').all()) {
      await expect(img).toHaveAttribute('alt', /.+/)
      await expect(img).toHaveAttribute('width', '1200')
      await expect(img).toHaveAttribute('height', '750')
    }
  })

  test('nine commissioned briefs, all accepted', async ({ page }) => {
    await page.goto('/')
    const briefs = page.getByRole('list', { name: /video briefs/ })
    await expect(briefs.getByRole('listitem')).toHaveCount(9)
    await expect(briefs.getByText('Accepted', { exact: true })).toHaveCount(9)
  })
})

test('open books: monthly figures add up to the payout total', async ({ page }) => {
  await page.goto('/')
  const total = Number(await page.locator('#open-books dd').first().textContent())
  const counts = await page
    .getByRole('table', { name: 'Approved payouts per month' })
    .locator('tbody td')
    .allTextContents()
  expect(counts.length).toBeGreaterThan(0)
  expect(counts.reduce((sum, c) => sum + Number(c), 0)).toBe(total)
})

test('FAQ answers are all visible without toggles', async ({ page }) => {
  await page.goto('/')
  const faq = page.getByRole('region', { name: 'Questions, answered' })
  await expect(faq.getByRole('term')).toHaveCount(6)
  await expect(faq.getByText(/A vetted specialist from the MultiAgency network/)).toBeVisible()
})

test('one label for the contact intent, and a skip link', async ({ page }) => {
  await page.goto('/')
  const labels = await page
    .locator('a[href="https://multiagency.ai/contact"]')
    .evaluateAll((as) => [...new Set(as.map((a) => a.textContent?.trim()))])
  expect(labels).toEqual(['Start a project'])
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
})

test('no em or en dashes in visible text', async ({ page }) => {
  await page.goto('/')
  expect(await page.evaluate(() => /[–—]/.test(document.body.innerText))).toBe(false)
})

test('every in-page link has a target', async ({ page }) => {
  await page.goto('/')
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  expect(hrefs.length).toBeGreaterThan(0)
  for (const href of new Set(hrefs)) await expect(page.locator(href as string)).toHaveCount(1)
})

test('mobile menu opens as a compact panel and closes on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  const menu = page.getByRole('navigation', { name: 'Menu' })
  await expect(menu).toBeVisible()
  expect((await menu.boundingBox())?.height).toBeLessThan(420)
  await menu.getByRole('link', { name: 'Services' }).click()
  await expect(menu).toBeHidden()
})

test('the page never shifts while loading (CLS)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
        if (!e.hadRecentInput) w.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.02)
})
