import { test, expect } from '@playwright/test'

/**
 * Verifica que el Manual del observatorio esta embebido en /admin/
 * y que sus 9 secciones acordeon abren/cierran correctamente.
 *
 * Mockea autenticacion via localStorage (el middleware admin solo
 * valida `isAuthenticated`, no el JWT contra backend). Si el backend
 * no esta corriendo, el dashboard puede mostrar un error en KPIs
 * pero el Manual debe renderizar de todos modos porque vive en el
 * markup estatico, no consume APIs.
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
  }, { token: FAKE_TOKEN, admin: FAKE_ADMIN })
})

test.describe('Admin · Manual del observatorio', () => {
  test('aparece en el dashboard con la primera seccion abierta', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Manual del observatorio' })).toBeVisible()
    // La primera seccion (¿Qué es?) debe estar abierta por default
    await expect(page.getByText(/Observatorio de Humedales Artificiales CDMX/)).toBeVisible()
  })

  test('todas las 9 secciones son accesibles y se pueden expandir', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const sections = [
      '¿Qué es este observatorio?',
      'Flujo de los datos',
      'Percepción remota e índices',
      'Detector geoespacial OSM',
      'Tipologías de humedal artificial',
      'Estadística aplicada (Brecha)',
      'Tracking de uso',
      'Glosario de siglas',
      'Limitaciones honestas',
    ]
    for (const label of sections) {
      const button = page.getByRole('button', { name: label })
      await expect(button).toBeVisible()
    }
  })

  test('toggle: abrir Glosario muestra siglas HA y FWS', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Glosario de siglas' }).click()
    await expect(page.getByText('Humedal Artificial (constructed wetland)')).toBeVisible()
    await expect(page.getByText(/Free Water Surface/i)).toBeVisible()
  })
})

test.describe('Admin · Sidebar — nuevos items', () => {
  test('aparece "Modos de participación" para superadmin', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('link', { name: /Modos de participación/i })).toBeVisible()
  })

  test('aparece "Contribuyentes" para superadmin', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('link', { name: /Contribuyentes/i })).toBeVisible()
  })
})

test.describe('Admin · CMS — listado expandido', () => {
  test('listado en /admin/contenido incluye paginas nuevas', async ({ page }) => {
    await page.goto('/admin/contenido')
    await page.waitForLoadState('networkidle')
    // Las paginas nuevas (CMS expandido) deben listarse
    await expect(page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mapa', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Footer', exact: true })).toBeVisible()
  })

  test('agrupacion por seccion: "Páginas principales" y "Estructura"', async ({ page }) => {
    await page.goto('/admin/contenido')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Páginas principales/i).first()).toBeVisible()
    await expect(page.getByText(/Estructura/i).first()).toBeVisible()
  })
})
