// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@sidebase/nuxt-auth",
    "@vee-validate/nuxt",
    "nuxt-typed-router",
    "@nuxt/image",
  ],
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
  ],
  imports: {
    dirs: ["composables", "~/utils/strings", "~/utils/requests/**"],
  },
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
});
