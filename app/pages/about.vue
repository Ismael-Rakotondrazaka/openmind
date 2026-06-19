<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const config = useRuntimeConfig();

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="flex min-h-svh items-center justify-center px-6 py-32">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">{{ t('aboutPage.openmind') }}</CardTitle>
        <CardDescription>{{ t('aboutPage.tagline') }}</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col items-center gap-4">
        <picture class="block w-full max-w-xs">
          <img
            src="/images/logo.svg"
            :alt="t('aboutPage.logo')"
            class="w-full object-cover"
          />
        </picture>
        <p class="text-center">
          {{ t('footerComponent.creator') }}
          <NuxtLinkLocale
            external
            to="https://www.ismaelrakoto.coom"
            target="_blank"
            class="text-primary hover:underline"
          >
            {{ t('footerComponent.ismael') }}
          </NuxtLinkLocale>
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
