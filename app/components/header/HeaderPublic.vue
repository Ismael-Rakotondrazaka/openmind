<template>
  <header
    class="fixed top-0 right-0 left-0 z-2 container mx-auto w-full rounded-b-md border-x border-b bg-[#e5fcd5] p-2"
  >
    <nav class="flex items-center justify-between gap-4">
      <div class="flex items-center">
        <NuxtLink :to="{ name: 'index' }" as-child>
          <Button variant="ghost">
            <NuxtImg
              src="/images/logo-150x150.png"
              alt="OpenMind"
              class="h-6 w-6"
              width="24"
              height="24"
            />

            <span class="sr-only text-base font-bold md:not-sr-only"
              >OpenMind</span
            >
          </Button>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink :to="{ name: 'login' }">
          <Button variant="secondary">
            <Icon name="mdi:login" />
            <span class="sr-only md:not-sr-only">Sign In</span>
          </Button>
        </NuxtLink>

        <NuxtLink :to="{ name: 'register' }">
          <Button variant="default">
            <Icon name="mdi:account-plus" />
            <span class="sr-only md:not-sr-only">Register</span>
          </Button>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts"></script>
