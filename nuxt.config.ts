import type { NuxtConfig } from 'nuxt/schema';

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

const makeLocaleFiles = (locale: string) =>
  [
    'auth',
    'buttons',
    'comments',
    'common',
    'errors',
    'forms',
    'header',
    'notifications',
    'pagination',
    'posts',
    'reactions',
    'statuses',
    'toasts',
    'users',
  ].map(name => `${locale}/${name}.json`);

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  components: {
    dirs: [
      {
        global: true,
        path: '~/components/global',
      },
      {
        path: '~/components/common',
        pathPrefix: false,
      },
      '~/components',
      {
        ignore: ['**/*.vue', '**/*.ts'],
        path: '~/features',
      },
    ],
  },

  css: ['~/assets/css/tailwind.css'],

  devtools: { enabled: false },

  experimental: {
    typedPages: true,
  },

  i18n: {
    bundle: {
      runtimeOnly: true,
    },
    defaultLocale: 'fr',
    experimental: {
      localeDetector: './localeDetector.ts',
    },
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        files: makeLocaleFiles('en'),
        iso: 'en-GB',
        name: 'English',
      },
      {
        code: 'fr',
        files: makeLocaleFiles('fr'),
        iso: 'fr-FR',
        name: 'Français',
      },
    ],
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
  },

  imports: {
    presets: [
      {
        from: '@vueuse/router',
        imports: ['useRouteQuery'],
      },
    ],
  },

  modules: [
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/seo',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@stefanobartoletti/nuxt-social-share',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    '@pinia/colada-nuxt',
    'nuxt-zod-i18n',
    '@nuxtjs/i18n',
    'nuxt-authorization',
  ],

  nitro: {
    experimental: {
      tasks: true,
      websocket: true,
    },
    scheduledTasks: {
      '* * * * *': ['notifications:process-queue'],
    },
  },

  ogImage: {
    enabled: false,
  },

  robots: {
    allow: '*',
    disallow: ['/posts/*/edit', '/profile', '/profile/edit'],
  },

  runtimeConfig: {
    brevo: {
      apiKey: '', // NUXT_BREVO_API_KEY
    },
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || 'latest',
    },
    s3: {
      accessKey: '', // NUXT_S3_ACCESS_KEY
      host: '', // NUXT_S3_HOST
      region: '', // NUXT_S3_REGION
      secretKey: '', // NUXT_S3_SECRET_KEY
    },
  },

  shadcn: {
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
  },

  site: {
    name: 'OpenMind',
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  sitemap: {
    sitemaps: {
      pages: {
        includeAppSources: true,
      },
      posts: {
        sources: ['/api/__sitemap__/posts'],
      },
      users: {
        sources: ['/api/__sitemap__/users'],
      },
    },
  },

  socialShare: {
    baseUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  typescript: {},

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      ErrorMessage: 'VeeErrorMessage',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      Form: 'VeeForm',
    },
  },

  vite: {
    plugins: [
      tailwindcss() as Exclude<NuxtConfig['vite'], undefined>['plugins'],
    ],
  },

  zodI18n: {
    localeCodesMapping: {
      'en-GB': 'en',
      'fr-FR': 'fr',
    },
  },
});
