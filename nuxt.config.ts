// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "page",
      mode: "in-out",
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@sidebase/nuxt-auth",
    "@vee-validate/nuxt",
    "nuxt-typed-router",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@formkit/auto-animate/nuxt",
    "@nuxtjs/seo",
  ],

  site: {
    indexable: true,
    name: "OpenMind",
    description: "Unleash Your Thoughts, Explore Every Topic.",
    defaultLocale: "en",
  },

  typescript: {
    shim: false,
  },

  runtimeConfig: {
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    informationEmail: "",
    bucketName: "",
    bucketEntryPoint: "",
    signedMutationUrlLifetime: 0,
    authSecret: "",
    public: {
      appUrl: "http://localhost:3000",
    },
  },

  components: [
    {
      path: "~/components",
      extensions: ["vue"],
    },
    {
      path: "~/components/tags",
      extensions: ["vue"],
    },
    {
      path: "~/components/articles",
      extensions: ["vue"],
    },
    {
      path: "~/components/commons",
      extensions: ["vue"],
    },
    {
      path: "~/components/inputs",
      extensions: ["vue"],
    },
    {
      path: "~/components/reactions",
      extensions: ["vue"],
    },
    {
      path: "~/components/comments",
      extensions: ["vue"],
    },
    {
      path: "~/components/savedArticles",
      extensions: ["vue"],
    },
    {
      path: "~/components/views",
      extensions: ["vue"],
    },
    {
      path: "~/components/users",
      extensions: ["vue"],
    },
    {
      path: "~/components/contents",
      extensions: ["vue"],
    },
    {
      path: "~/components/dialogs",
      extensions: ["vue"],
    },
    {
      path: "~/components/follows",
      extensions: ["vue"],
    },
    {
      path: "~/components/OgImage",
      extensions: ["vue"],
    },
  ],

  primevue: {
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
    options: {
      ripple: true,
    },
    components: {
      prefix: "Prime",
      include: "*",
      exclude: ["Galleria", "Chart"],
    },
  },

  css: [
    "primeicons/primeicons.css",
    "primevue/resources/themes/lara-light-teal/theme.css",
  ],

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },

  image: {
    domains: ["storage.googleapis.com"],
  },

  devtools: {
    enabled: true,
  },
});
