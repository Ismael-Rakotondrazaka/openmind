<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <header
    class="fixed top-0 right-0 left-0 z-2 container mx-auto w-full rounded-b-md border-x border-b bg-[#e5fcd5] p-2"
  >
    <nav class="flex items-center justify-between gap-4">
      <div class="flex items-center">
        <NuxtLinkLocale :to="{ name: 'index' }" as-child>
          <Button variant="ghost">
            <NuxtImg
              src="/images/logo-150x150.png"
              :alt="t('common.brand.name')"
              class="h-6 w-6"
              width="24"
              height="24"
            />

            <span class="sr-only text-base font-bold md:not-sr-only">{{
              t('common.brand.name')
            }}</span>
          </Button>
        </NuxtLinkLocale>
      </div>

      <div class="flex items-center gap-2">
        <HeaderLocaleSwitcher />

        <NuxtLinkLocale :to="{ name: 'login' }">
          <Button variant="secondary">
            <Icon name="mdi:login" />
            <span class="sr-only md:not-sr-only">{{
              t('headerPublic.signIn')
            }}</span>
          </Button>
        </NuxtLinkLocale>

        <NuxtLinkLocale :to="{ name: 'register' }">
          <Button variant="default">
            <Icon name="mdi:account-plus" />
            <span class="sr-only md:not-sr-only">{{
              t('headerPublic.register')
            }}</span>
          </Button>
        </NuxtLinkLocale>
      </div>
    </nav>
  </header>
</template>
