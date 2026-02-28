<template>
  <div class="flex min-h-svh items-center justify-center px-6 py-32">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">OpenMind</CardTitle>
        <CardDescription
          >Unleash Your Thoughts, Explore Every Topic.</CardDescription
        >
      </CardHeader>
      <CardContent class="flex flex-col items-center gap-4">
        <picture class="block w-full max-w-xs">
          <img src="/images/logo.svg" alt="Logo" class="w-full object-cover" />
        </picture>
        <p class="text-center">
          Created by
          <NuxtLink
            to="https://github.com/Ismael-Rakotondrazaka"
            target="_blank"
            class="text-primary hover:underline"
          >
            Ismael
          </NuxtLink>
        </p>
      </CardContent>
      <CardFooter>
        <p class="text-muted-foreground text-sm">
          {{ config.public.appVersion }}
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
</script>
