import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

const fill = async (page: import('@playwright/test').Page) => {
  await page.getByLabel('Name').fill('Ada Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('The brief').fill('A launch video for our 2.0 release, about a minute long, with captions.')
}

test('every Hire us link leads to our own contact page', async ({ page, isMobile }) => {
  await page.goto('/')
  // On phones the header's "Hire us" lives in the menu.
  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('banner').getByRole('link', { name: 'Hire us' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tell us what you need.')
})

test('contact page has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/contact')
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

test('an empty form shows errors beside the fields and focuses the first', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Send the brief' }).click()
  await expect(page.getByLabel('Name')).toBeFocused()
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Enter an email we can reply to.')).toBeVisible()
})

test('a valid brief is sent and confirmed', async ({ page }) => {
  let sent: Record<string, string> | undefined
  await page.route('/api/contact', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })
  await page.goto('/contact')
  await page.getByText('Video', { exact: true }).click()
  await fill(page)
  await page.getByRole('button', { name: 'Send the brief' }).click()
  await expect(page.getByRole('heading', { name: 'Brief received.' })).toBeFocused()
  expect(sent).toMatchObject({ name: 'Ada Lovelace', email: 'ada@example.com', kind: 'Video' })
})

test('a failed send keeps the text and says so', async ({ page }) => {
  await page.route('/api/contact', (route) => route.fulfill({ status: 503, json: { ok: false } }))
  await page.goto('/contact')
  await fill(page)
  await page.getByRole('button', { name: 'Send the brief' }).click()
  await expect(page.getByRole('status')).toHaveText(/did not go through/)
  await expect(page.getByLabel('Name')).toHaveValue('Ada Lovelace')
})

test.describe('POST /api/contact', () => {
  test('rejects an invalid inquiry with field errors', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { name: '', email: 'nope', message: 'hi' } })
    expect(res.status()).toBe(422)
    const body = await res.json()
    expect(Object.keys(body.errors).sort()).toEqual(['email', 'message', 'name'])
  })

  test('drops honeypot submissions quietly', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { website: 'http://spam.example' } })
    expect(res.status()).toBe(200)
  })

  test('never pretends to deliver when no webhook is configured', async ({ request }) => {
    test.skip(!!process.env.CONTACT_WEBHOOK_URL, 'a webhook is configured')
    const res = await request.post('/api/contact', {
      data: { name: 'Ada', email: 'ada@example.com', message: 'A real brief, long enough to pass.' },
    })
    expect(res.status()).toBe(503)
  })

  test('without scripts, the form posts and redirects back', async ({ request }) => {
    const res = await request.post('/api/contact', {
      form: { name: '', email: '', message: '' },
      maxRedirects: 0,
    })
    expect(res.status()).toBe(303)
    expect(res.headers().location).toBe('/contact#error')
  })
})
