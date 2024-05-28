<template>
  <div
    class="mx-auto w-full max-w-[1200px] rounded-t border border-b-0 bg-emerald-400 bg-opacity-10"
  >
    <div class="flex items-center justify-around p-7">
      <img
        src="/images/logo-300x300.png"
        alt="Openmind logo"
        class="hidden w-1/6 rounded-full md:block"
      />

      <div class="flex flex-col items-center gap-5 text-center">
        <ul class="text-center">
          <li class="mr-5 inline-block">
            <a href="mailto:ismaelrakotondrazaka@gmail.com" target="_blank"
              ><PrimeButton icon="pi pi-google" rounded
            /></a>
          </li>
          <li class="inline-block">
            <a
              href="https://github.com/Ismael-Rakotondrazaka/openmind"
              target="_blank"
              ><PrimeButton icon="pi pi-github" rounded
            /></a>
          </li>
        </ul>

        <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <!-- @vue-skip :to expect a NuxtRoute but error is thrown when importing from "@typed-router/__router" -->
          <NuxtLink
            v-for="link in links"
            :key="link.route"
            :to="link.route"
            rel="noopener"
          >
            <PrimeButton :label="link.label" link />
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="bg-emerald-700 p-7 text-center text-white">
      © Copyright {{ year }}
      <a href="http://github.com/Ismael-Rakotondrazaka">Ismael</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const year = new Date().getFullYear();

const links = [
  {
    label: "Home",
    route: {
      name: "index",
    },
  },
  {
    label: "Articles",
    route: {
      name: "articles",
    },
  },
  {
    label: "Users",
    route: {
      name: "users",
    },
  },
  {
    label: "About",
    route: {
      name: "about",
    },
  },
  {
    label: "Sign in",
    route: {
      name: "signin",
    },
  },
  {
    label: "Register",
    route: {
      name: "register",
    },
  },
];
</script>

<style></style>
