<script lang="ts" setup></script>

<template>
  <footer class="container mx-auto">
    <div class="bg-opacity-10 rounded-t-md border border-b-0 bg-[#e5fcd5]">
      <div class="flex items-center justify-around p-7">
        <img
          src="/images/logo-300x300.png"
          alt="Openmind logo"
          class="hidden w-1/6 rounded-full md:block"
        />

        <div class="flex flex-col items-center gap-5 text-center">
          <div class="flex gap-2">
            <Button variant="outline" size="icon" class="rounded-full" as-child>
              <a
                href="mailto:contact@ismaelrakoto.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <Icon name="mdi:email" />
              </a>
            </Button>

            <Button variant="outline" size="icon" class="rounded-full" as-child>
              <a
                href="https://github.com/Ismael-Rakotondrazaka/openmind"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Icon name="mdi:github" />
              </a>
            </Button>
          </div>

          <div
            class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <NuxtLink :to="{ name: 'index' }" as-child>
              <Button variant="link">Home</Button>
            </NuxtLink>

            <NuxtLink to="/about" as-child>
              <Button variant="link">About</Button>
            </NuxtLink>

            <NuxtLink :to="{ name: 'login' }" as-child>
              <Button variant="link">Sign in</Button>
            </NuxtLink>

            <NuxtLink :to="{ name: 'register' }" as-child>
              <Button variant="link">Register</Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1a6b4b] p-7 text-center text-white">
      © Copyright {{ new Date().getFullYear() }}
      <a
        href="https://github.com/Ismael-Rakotondrazaka"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >Ismael</a
      >
    </div>
  </footer>
</template>
