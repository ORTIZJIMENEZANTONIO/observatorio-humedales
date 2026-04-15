// PM2 — Observatorio de Humedales Artificiales
// Agregar esta entrada al ecosystem.config.cjs de cercu-frontend
module.exports = {
  apps: [
    {
      name: 'humedales',
      cwd: '/var/www/cercu-frontend/humedales',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        NUXT_PUBLIC_DATA_MODE: 'api',
        NUXT_PUBLIC_API_BASE_URL: 'https://humedales.cercu.com.mx/api/v1',
      },
      max_memory_restart: '200M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/humedales-error.log',
      out_file: '/var/log/pm2/humedales-out.log',
    },
  ],
};
