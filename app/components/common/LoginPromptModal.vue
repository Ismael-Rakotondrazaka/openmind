<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import ResponsiveModal from '@/components/common/ResponsiveModal.vue';
import { Button } from '@/components/ui/button';

type Props = {
  action: string;
};

defineProps<Props>();

const open = defineModel<boolean>('open', { required: true });
const { t } = useI18n();
</script>

<template>
  <ResponsiveModal v-model:open="open">
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="mdi:lock-outline" class="text-primary size-5" />
        {{ t('auth.loginPrompt.title') }}
      </div>
    </template>
    <template #description>
      {{ t('auth.loginPrompt.description') }} {{ action }}.
    </template>
    <div class="flex flex-col gap-3 pt-4">
      <NuxtLinkLocale :to="{ name: 'login' }" @click="open = false">
        <Button class="w-full">{{ t('auth.loginPrompt.login') }}</Button>
      </NuxtLinkLocale>
      <NuxtLinkLocale :to="{ name: 'register' }" @click="open = false">
        <Button variant="outline" class="w-full">{{
          t('auth.loginPrompt.createAccount')
        }}</Button>
      </NuxtLinkLocale>
    </div>
  </ResponsiveModal>
</template>
