import { defineConfig, devices } from '@playwright/test'

// Playwright e2e config para el Observatorio de Humedales.
// Los tests viven en tests/e2e y arrancan el servidor de desarrollo si no esta corriendo.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Opcional: si quieres que Playwright arranque el dev server, descomentar.
  // Lo dejo opcional porque en local muchas veces ya esta corriendo en :3000
  // y forzar otro arranque ralentiza el ciclo. En CI conviene activarlo.
  ...(process.env.CI
    ? {
      webServer: {
        command: 'npm run build && npm run preview',
        url: 'http://localhost:3000',
        timeout: 120_000,
        reuseExistingServer: false,
      },
    }
    : {}),
})
