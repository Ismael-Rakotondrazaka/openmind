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
  ],
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
  supabase: {
    redirectOptions: {
      callback: '/confirm',
      exclude: ['/', '/register'],
      include: undefined,
      login: '/login',
      saveRedirectToCookie: false,
    },
    types: '#shared/types/database.ts',
  },
  typescript: {
    tsConfig: {
      exclude: ['shared/types/database.ts'],
    },
  },
  vite: {
    plugins: [
      tailwindcss() as Exclude<NuxtConfig['vite'], undefined>['plugins'],
    ],
  },
});
