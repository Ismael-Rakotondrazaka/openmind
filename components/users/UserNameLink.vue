<template>
  <span>
    <NuxtLink
      :to="{
        name: 'users-username',
        params: {
          username: user.username,
        },
      }"
      class="font-bold text-[--text-color-primary] hover:text-[--primary-color] hover:underline"
      @mouseenter="showOverlayPanel"
      >{{ fullName }}</NuxtLink
    >

    <PrimeOverlayPanel
      ref="overlayPanel"
      :pt="{
        content: {
          class: '!p-0',
        },
      }"
    >
      <UserProfilePreview :user="user" @preview:hide="onPreviewHideHandler" />
    </PrimeOverlayPanel>
  </span>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface UserNameLinkProps {
  user: User;
}

const props = defineProps<UserNameLinkProps>();

const fullName = computed(() => `${props.user.firstName} ${props.user.name}`);

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const showOverlayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.show(event);
  }
};

const onPreviewHideHandler = () => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.hide();
  }
};
</script>
