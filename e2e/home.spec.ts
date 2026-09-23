import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

test('home renders the headline', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Build agencies\s*together\./)
})

test('home has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/')
  // Measure the settled page: mid-fade, the hero's text is part-transparent and reads as low contrast.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => (a as CSSAnimation).animationName !== 'rise' || a.playState === 'finished'),
  )
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

test('no horizontal overflow on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('no animation loops (the hero video is the one loop)', async ({ page }) => {
  await page.goto('/')
  const looping = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().iterations === Number.POSITIVE_INFINITY)
      .map((a) => (a as CSSAnimation).animationName),
  )
  expect(looping).toEqual([])
})

test.describe('hero video', () => {
  const video = (page: Page) =>
    page.locator('#main video').evaluate((v: HTMLVideoElement) => ({ paused: v.paused, loaded: v.readyState > 0 }))

  test('plays after load, with no controls of its own', async ({ page }) => {
    await page.goto('/')
    await expect.poll(async () => (await video(page)).paused).toBe(false)
    await expect(page.getByRole('button', { name: /background video/ })).toHaveCount(0)
  })

  test('fills the footer wordmark, loading only once scrolled to', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer video')
    const state = () => footer.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, loaded: v.readyState > 0 }))
    expect(await state()).toEqual({ paused: true, loaded: false })
    await footer.scrollIntoViewIfNeeded()
    await expect.poll(async () => (await state()).paused).toBe(false)
  })

  test('stays a still poster, never downloaded, under reduced motion', async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'networkidle' })
    expect(await video(page)).toEqual({ paused: true, loaded: false })
    await page.close()
  })
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
    await expect(panel).toHaveAccessibleName(/Bots/)
    await expect(panel.getByRole('listitem').filter({ hasText: 'Conversation flows, tool integrations' })).toHaveCount(
      1,
    )
  })

  test('exactly one of six steps is done by AI', async ({ page }) => {
    await page.goto('/')
    const steps = page.getByRole('tabpanel').getByRole('listitem')
    await expect(steps).toHaveCount(6)
    await expect(steps.filter({ hasText: 'owned by AI' })).toHaveCount(1)
  })

  test('the terminal types the pipeline out in full', async ({ page }) => {
    await page.goto('/')
    const draft = page.getByRole('tabpanel').locator('[aria-hidden="true"]').getByText('Draft', { exact: true })
    await expect(draft).toBeVisible({ timeout: 10_000 })
  })
})

test('the comparison is one real table at every width', async ({ page, isMobile }) => {
  await page.goto('/')
  const table = page.getByRole('table', { name: /How MultiAgency compares/ })
  const headers = table.getByRole('columnheader')
  await expect(headers).toHaveCount(3)
  for (const [i, name] of ['A typical agency', 'AI tools alone', 'MultiAgency'].entries())
    await expect(headers.nth(i)).toHaveAccessibleName(name)
  await expect(table.getByRole('rowheader')).toHaveCount(5)
  // Phones show only the mark for the other two columns; the words are still there for screen readers.
  const weeks = (await table.getByText('Weeks').boundingBox())?.width ?? 0
  if (isMobile) expect(weeks).toBeLessThanOrEqual(1)
  else expect(weeks).toBeGreaterThan(20)
  await expect(table.getByText('Hours')).toBeVisible()
})

test('the console covers all four kinds of project', async ({ page }) => {
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Choose a kind of project' }).getByRole('tab')
  await expect(tabs).toHaveText(['Product', 'Bots', 'Video', 'Social'])
})

test.describe('work', () => {
  test('the five projects the live site lists, in its order', async ({ page }) => {
    await page.goto('/')
    const work = page.getByRole('region', { name: /Our work/ })
    await expect(work.getByRole('heading', { level: 3 })).toHaveText([
      'Ping',
      'City Nodes',
      'NEAR Builders',
      'NEAR Builders social',
      'NEAR Builders Bot',
    ])
  })

  test('safe external links, reserved image sizes', async ({ page }) => {
    await page.goto('/')
    const work = page.getByRole('region', { name: /Our work/ })
    for (const link of await work.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
    for (const img of await work.locator('img').all()) {
      await expect(img).toHaveAttribute('alt', /.+/)
      await expect(img).toHaveAttribute('width', '1200')
      await expect(img).toHaveAttribute('height', '750')
    }
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

test('FAQ answers slide open and closed from their questions', async ({ page }) => {
  await page.goto('/')
  const faq = page.getByRole('region', { name: /Questions, answered/ })
  const questions = faq.getByRole('button')
  await expect(questions).toHaveCount(6)
  for (const q of await questions.all()) await expect(q).toHaveAttribute('aria-expanded', 'false')

  const who = faq.getByRole('button', { name: 'Who actually does the work?' })
  const answer = faq.getByText(/A vetted specialist from the MultiAgency network/)
  await expect(answer).not.toBeInViewport()
  await who.click()
  await expect(who).toHaveAttribute('aria-expanded', 'true')
  await expect(answer).toBeVisible()
  await expect(answer).toBeInViewport()
  await who.press('Enter')
  await expect(who).toHaveAttribute('aria-expanded', 'false')
})

test('closed FAQ answers cannot be tabbed into', async ({ page }) => {
  await page.goto('/')
  const hire = page.locator('#faq a[href="/contact"]')
  await expect(hire).toHaveCount(1)
  expect(await hire.evaluate((a) => a.closest('[inert]') !== null)).toBe(true)
})

test('one label for the contact intent, and a skip link', async ({ page }) => {
  await page.goto('/')
  const labels = await page
    .locator('a[href="/contact"]')
    .evaluateAll((as) => [...new Set(as.map((a) => a.textContent?.trim()))])
  expect(labels).toEqual(['Hire us'])
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
  await menu.getByRole('link', { name: 'Work' }).click()
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

test.describe('dark only', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`paints dark from the first frame with a ${colorScheme} system theme`, async ({ browser }) => {
      const page = await browser.newPage({ colorScheme })
      await page.goto('/', { waitUntil: 'commit' })
      await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark')
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000')
      const bg = (sel: string) =>
        page.evaluate((s) => getComputedStyle(document.querySelector(s) as Element).backgroundColor, sel)
      expect(await bg('html')).toBe('rgb(0, 0, 0)')
      await page.waitForLoadState('load')
      expect(await bg('body')).toBe('rgb(0, 0, 0)')
      await page.close()
    })
  }
})
