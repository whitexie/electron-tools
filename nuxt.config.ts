import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Nuxt 4 uses app/ as the default source directory
  // This is already the default in Nuxt 4, but we can be explicit
  srcDir: 'app/',

  // Modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },

  ui: {
    fonts: false,
    colorMode: false,
  },

  // Configure for static site generation in Nuxt 4
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
    },
  },

  // Enable SSR for static generation
  ssr: true,

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // App configuration for Electron icon converter
  app: {
    head: {
      title: 'Electron Icon Converter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Convert images to Electron app icons for Windows, macOS, and Linux' },
        { name: 'keywords', content: 'electron, icon, converter, ico, icns, png, windows, macos, linux' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Component auto-import configuration
  components: {
    dirs: [],
  },

  // Auto-import configuration for composables
  imports: {
    // autoImport: false,
    scan: false,
  },

  // CSS configuration
  css: [
    '~/assets/css/main.css',
  ],

  // Color mode configuration
  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  // UI configuration is now handled in app.config.ts

  // Experimental features for Nuxt 4
  experimental: {
    payloadExtraction: false,
    typedPages: true,
  },
})
