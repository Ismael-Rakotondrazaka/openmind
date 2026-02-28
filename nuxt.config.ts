import type { NuxtConfig } from 'nuxt/schema';

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

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
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },
  imports: {
    presets: [
      {
        from: '@tanstack/vue-query',
        imports: [
          // Composables
          'useQuery',
          'useInfiniteQuery',
          'useMutation',
          'useQueries',
          'useQueryClient',
          'useIsFetching',
          'useIsMutating',
          'useMutationState',

          // Utilities
          'queryOptions',
          'infiniteQueryOptions',
          'keepPreviousData',

          // Classes
          'QueryClient',
          'QueryCache',
          'MutationCache',

          // Plugin
          'VueQueryPlugin',
          'VueQueryPluginOptions',

          // Types (for type support)
          'DefinedInitialDataInfiniteOptions',
          'DefinedInitialQueryOptions',
          'UndefinedInitialDataInfiniteOptions',
          'UndefinedInitialQueryOptions',
          'UseInfiniteQueryOptions',
          'UseInfiniteQueryReturnType',
          'UseQueryOptions',
          'UseQueryReturnType',
          'UseQueriesOptions',
          'UseQueriesResults',
          'UseMutationOptions',
          'UseMutationReturnType',
          'QueryFilters',
          'MutationFilters',
          'MutationStateOptions',
        ],
      },
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
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@stefanobartoletti/nuxt-social-share',
  ],
  runtimeConfig: {
    public: {
      appUrl: 'http://localhost:3000',
      appVersion: 'latest',
      siteUrl: 'http://localhost:3000',
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
  socialShare: {
    baseUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  supabase: {
    redirectOptions: {
      callback: '/confirm',
      exclude: [
        '/',
        '/register',
        '/password/reset',
        '/password/update',
        '/raw/**',
        '/u/*',
        '/u/*/p/*/*',
      ],
      include: undefined,
      login: '/login',
      saveRedirectToCookie: true,
    },
    types: '#shared/types/database.ts',
  },
  typescript: {
    tsConfig: {
      exclude: ['shared/types/database.ts'],
    },
  },
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
});
