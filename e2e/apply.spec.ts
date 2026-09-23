import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

const fill = async (page: Page) => {
  await page.getByLabel('Name').fill('Ada Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page
    .getByLabel('About your work', { exact: true })
    .fill('Motion design for launch videos, and one IronClaw explainer.')
}

test('every Apply to join link leads to our own apply page', async ({ page }) => {
  await page.goto('/')
  const links = await page
    .locator('a', { hasText: 'Apply to join' })
    .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  expect(links).toEqual(['/apply'])
  await page.getByRole('main').getByRole('link', { name: 'Apply to join' }).first().click()
  await expect(page).toHaveURL(/\/apply$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tell us about your work.')
})

test('apply page has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/apply')
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

test('open work on NEARN stays one click away', async ({ page }) => {
  await page.goto('/apply')
  const nearn = page.getByRole('link', { name: /Open listings on NEARN/ })
  await expect(nearn).toHaveAttribute('href', 'https://nearn.io/multiagency/')
  await expect(nearn).toHaveAttribute('rel', /noopener/)
})

test('a bad NEAR account is caught beside the field', async ({ page }) => {
  await page.goto('/apply')
  await fill(page)
  await page.getByLabel('NEAR account').fill('not an account')
  await page.getByRole('button', { name: 'Send the application' }).click()
  await expect(page.getByLabel('NEAR account')).toBeFocused()
  await expect(page.getByLabel('NEAR account')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Use a NEAR account like name.near')).toBeVisible()
})

test('a valid application is sent and confirmed', async ({ page }) => {
  let sent: Record<string, string> | undefined
  await page.route('/api/apply', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })
  await page.goto('/apply')
  await page.getByText('Video', { exact: true }).click()
  await fill(page)
  await page.getByLabel('NEAR account').fill('ada.near')
  await page.getByRole('button', { name: 'Send the application' }).click()
  await expect(page.getByRole('heading', { name: 'Application received.' })).toBeFocused()
  expect(sent).toMatchObject({ name: 'Ada Lovelace', skill: 'Video', near: 'ada.near' })
})

test.describe('POST /api/apply', () => {
  test('rejects an invalid application with field errors', async ({ request }) => {
    const res = await request.post('/api/apply', { data: { name: 'Ada', email: 'x', near: 'nope', message: 'hi' } })
    expect(res.status()).toBe(422)
    expect(Object.keys((await res.json()).errors).sort()).toEqual(['email', 'message', 'near'])
  })

  test('never pretends to deliver when no webhook is configured', async ({ request }) => {
    test.skip(!!(process.env.CONTACT_WEBHOOK_URL || process.env.APPLY_WEBHOOK_URL), 'a webhook is configured')
    const res = await request.post('/api/apply', {
      data: { name: 'Ada', email: 'ada@example.com', message: 'A real application, long enough to pass.' },
    })
    expect(res.status()).toBe(503)
  })

  test('without scripts, the form posts and redirects back to /apply', async ({ request }) => {
    const res = await request.post('/api/apply', { form: { name: '' }, maxRedirects: 0 })
    expect(res.status()).toBe(303)
    expect(res.headers().location).toBe('/apply#error')
  })
})
