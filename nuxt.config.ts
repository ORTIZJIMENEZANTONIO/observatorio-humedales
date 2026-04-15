export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-icon',
  ],

  ssr: false,

  runtimeConfig: {
    public: {
      dataMode: 'mock',
      apiBaseUrl: 'http://localhost:3003/api/v1', // env: NUXT_PUBLIC_API_BASE_URL
      observatory: 'humedales',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Observatorio de Humedales Artificiales CDMX',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          name: 'description',
          content:
            'Plataforma de monitoreo y análisis de humedales artificiales en la Ciudad de México. Visualización geoespacial, inventario y servicios ecosistémicos.',
        },
        {
          name: 'keywords',
          content:
            'humedales artificiales, CDMX, Ciudad de México, infraestructura verde, tratamiento de agua, biodiversidad, servicios ecosistémicos, observatorio',
        },
        { name: 'author', content: 'Observatorio de Humedales Artificiales CDMX' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: 'Observatorio de Humedales Artificiales CDMX',
        },
        {
          property: 'og:description',
          content:
            'Plataforma de monitoreo y análisis de humedales artificiales en la Ciudad de México.',
        },
        { property: 'og:locale', content: 'es_MX' },
        { name: 'theme-color', content: '#0D6B7E' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
    exposeConfig: false,
    viewer: true,
  },

  compatibilityDate: '2025-03-01',
})
