import { test, expect } from '@playwright/test'

/**
 * E2E: CRUD de modos de participacion (tiers) y contribuyentes,
 * mas el flujo de atribucion en /admin/prospectos.
 *
 * Mockea autenticacion via localStorage para saltar el login.
 * Los stores son client-side con persistencia en localStorage,
 * asi que estos tests funcionan sin backend.
 */

const FAKE_TOKEN = 'e2e-fake-token'
const FAKE_ADMIN = JSON.stringify({
  id: 'e2e-1',
  email: 'e2e@test.com',
  name: 'E2E Tester',
  observatories: ['humedales'],
  role: 'superadmin',
  permissions: [
    'manage_users', 'manage_cms', 'manage_humedales',
    'manage_hallazgos', 'manage_notihumedal', 'manage_prospectos',
    'manage_tiers', 'manage_contributors',
  ],
})

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(({ token, admin }) => {
    localStorage.setItem('obs_token', token)
    localStorage.setItem('obs_admin', admin)
    // Limpia overrides de stores para empezar de cero
    localStorage.removeItem('obs-humedales-tiers')
    localStorage.removeItem('obs-humedales-contributors')
  }, { token: FAKE_TOKEN, admin: FAKE_ADMIN })
})

test.describe('Admin · Tiers — Modos de participacion', () => {
  test('lista los 5 modos default', async ({ page }) => {
    await page.goto('/admin/tiers')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Aprendiz', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Observador', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Caracterizador', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Especialista', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Custodio', exact: true })).toBeVisible()
  })

  test('crear un nuevo modo via modal', async ({ page }) => {
    await page.goto('/admin/tiers')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /Nuevo modo/i }).click()
    await page.getByLabel(/^Slug/i).fill('embajador')
    await page.getByLabel(/Etiqueta/i).fill('Embajador del Humedal')
    await page.getByLabel(/Score min/i).fill('2000')
    await page.getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByRole('heading', { name: 'Embajador del Humedal' })).toBeVisible()
  })
})

test.describe('Admin · Contributors', () => {
  test('lista los 3 contribuyentes seed', async ({ page }) => {
    await page.goto('/admin/contributors')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: /Equipo CIIEMAD-IPN/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Diego Domínguez Solís/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /GAIA/i })).toBeVisible()
  })

  test('crear un nuevo contribuyente', async ({ page }) => {
    await page.goto('/admin/contributors')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /Nuevo contribuyente/i }).click()
    await page.getByLabel(/^Nombre/i).fill('Ana López')
    await page.getByLabel(/Handle/i).fill('ana-lopez')
    await page.getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByRole('heading', { name: 'Ana López' })).toBeVisible()
  })

  test('filtrar por tier "custodio" deja solo institucionales', async ({ page }) => {
    await page.goto('/admin/contributors')
    await page.waitForLoadState('networkidle')
    // Selecciona el filtro "Todos los modos" y cambialo a custodio
    const tierFilter = page.locator('select').nth(2)
    await tierFilter.selectOption('custodio')
    await expect(page.getByRole('heading', { name: /Equipo CIIEMAD-IPN/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /GAIA/i })).toBeVisible()
    // El especialista NO debe estar visible
    await expect(page.getByRole('heading', { name: /Diego Domínguez Solís/i })).not.toBeVisible()
  })
})
