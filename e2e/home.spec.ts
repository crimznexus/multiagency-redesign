import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home renders the headline', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We draft with AI and ship with people.')
})

test('home has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/')
  // The review workspace's visuals are aria-hidden and mid-animation here (a fading line
  // briefly fails contrast); they're audited in their settled state by the reduced-motion test.
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .exclude('[data-animated]')
    .analyze()
  expect(results.violations).toEqual([])
})

test('no horizontal overflow on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test.describe('review workspace', () => {
  test('example tabs switch with the keyboard', async ({ page }) => {
    await page.goto('/')
    const tabs = page.getByRole('tab')
    await expect(tabs).toHaveCount(3)
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('figure')).toHaveAccessibleName(/Ping · onramp checkout/)
  })

  test('reduced motion shows the finished, approved example without animating', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByText('Approved · to edit', { exact: true })).toBeVisible()
    await expect(page.getByText('your agent now works in group chats.', { exact: true })).toBeVisible()
    await context.close()
  })

  test('the approved state (comment, stamp, edits) has no WCAG 2.2 AA violations', async ({ browser }) => {
    // Axe only sees one frame of an animation; reduced motion pins the fullest one.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByText('Approved · to edit', { exact: true })).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations).toEqual([])
    await context.close()
  })
})

test('mobile menu opens as a compact panel and closes on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  const menu = page.getByRole('navigation', { name: 'Menu' })
  await expect(menu).toBeVisible()
  expect((await menu.boundingBox())?.height).toBeLessThan(400)
  await menu.getByRole('link', { name: 'Services' }).click()
  await expect(menu).toBeHidden()
})
