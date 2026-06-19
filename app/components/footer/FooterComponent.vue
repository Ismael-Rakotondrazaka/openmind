<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <footer class="container mx-auto">
    <div class="bg-opacity-10 rounded-t-md border border-b-0 bg-[#e5fcd5]">
      <div class="flex items-center justify-around p-7">
        <img
          src="/images/logo-300x300.png"
          :alt="t('footerComponent.logoAlt')"
          class="hidden w-1/6 rounded-full md:block"
        />

        <div class="flex flex-col items-center gap-5 text-center">
          <div class="flex gap-2">
            <Button variant="outline" size="icon" class="rounded-full" as-child>
              <a
                href="mailto:contact@ismaelrakoto.com"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('footerComponent.email')"
              >
                <Icon name="mdi:email" />
              </a>
            </Button>

            <Button variant="outline" size="icon" class="rounded-full" as-child>
              <a
                href="https://github.com/Ismael-Rakotondrazaka/openmind"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('footerComponent.github')"
              >
                <Icon name="mdi:github" />
              </a>
            </Button>
          </div>

          <div
            class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <NuxtLinkLocale :to="{ name: 'index' }" as-child>
              <Button variant="link">{{ t('buttons.home') }}</Button>
            </NuxtLinkLocale>

            <NuxtLinkLocale :to="{ name: 'about' }" as-child>
              <Button variant="link">{{ t('buttons.about') }}</Button>
            </NuxtLinkLocale>

            <NuxtLinkLocale :to="{ name: 'login' }" as-child>
              <Button variant="link">{{ t('buttons.login') }}</Button>
            </NuxtLinkLocale>

            <NuxtLinkLocale :to="{ name: 'register' }" as-child>
              <Button variant="link">{{ t('buttons.register') }}</Button>
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1a6b4b] p-7 text-center text-white">
      {{ t('footerComponent.copyright') }} {{ new Date().getFullYear() }}
      <a
        href="https://github.com/Ismael-Rakotondrazaka"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >{{ t('footerComponent.ismael') }}</a
      >
    </div>
  </footer>
</template>
