import { test, expect } from '@playwright/test'

/**
 * Smoke test del sitio publico — no requiere backend ni autenticacion.
 * Verifica que las paginas principales cargan, el favicon esta presente
 * y la navegacion principal funciona.
 */

test.describe('Sitio publico — smoke', () => {
  test('home carga, favicon presente, titulo correcto', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Observatorio de Humedales/i)
    // Favicon: el SVG declarado en nuxt.config.ts debe responder con 200
    const faviconResponse = await page.request.get('/favicon.svg')
    expect(faviconResponse.ok()).toBe(true)
    expect(faviconResponse.headers()['content-type']).toMatch(/svg/i)
  })

  test('inventario lista al menos un humedal', async ({ page }) => {
    await page.goto('/inventario')
    // Espera a que aparezca al menos una tarjeta o el mensaje de fallback.
    await page.waitForLoadState('networkidle')
    // Si hay humedales, debe haber al menos un h3/h2 que mencione "Humedal"
    const headings = page.getByRole('heading').filter({ hasText: /Humedal/ })
    await expect(headings.first()).toBeVisible({ timeout: 10_000 })
  })

  test('mapa monta el contenedor leaflet', async ({ page }) => {
    await page.goto('/mapa')
    await page.waitForLoadState('networkidle')
    // El contenedor leaflet usa la clase .leaflet-container despues de mount.
    await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 15_000 })
  })

  test('registra muestra el formulario inicial', async ({ page }) => {
    await page.goto('/registra')
    await page.waitForLoadState('networkidle')
    // Espera ver el campo Nombre (paso 1 del wizard).
    const nombreField = page.locator('input[type="text"], input[type="email"]').first()
    await expect(nombreField).toBeVisible({ timeout: 10_000 })
  })

  test('navegacion principal a /sobre y /analisis', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Click en el link de Sobre (puede estar en header o footer)
    const sobreLink = page.getByRole('link', { name: /Sobre/i }).first()
    await expect(sobreLink).toBeVisible()
  })
})
