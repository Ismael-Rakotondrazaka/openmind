<template>
  <PrimeButton
    icon="pi pi-share-alt"
    severity="secondary"
    label="Share"
    text
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex, w-[20rem] flex-row flex-nowrap gap-3">
      <p class="text-900 mb-2 block font-medium">
        {{ title }}
      </p>

      <PrimeInputGroup>
        <PrimeInputText :value="profileUrl" readonly />

        <PrimeButton
          icon="pi pi-copy"
          outlined
          severity="secondary"
          class="bg-[--surface-100]"
          @click="onCopyHandler"
        />
      </PrimeInputGroup>
    </div>
  </PrimeOverlayPanel>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface ShareUserButtonProps {
  user: UserFull;
}

const props = defineProps<ShareUserButtonProps>();
const clipboard = useClipboard();
const toast = useToast();

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const toggleOverLayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const route = useRoute("users-username");

const { user: authUser } = useAuthUser();

const runtimeConfig = useRuntimeConfig();

const profileUrl = computed<string>(
  () => `${runtimeConfig.public.appUrl}${route.path}`,
);

const onCopyHandler = async () => {
  try {
    await clipboard.copy(profileUrl.value);

    toast.add({
      summary: "Link copied.",
      severity: "info",
      life: notificationConfig.LIFE,
    });
  } catch (error) {
    toast.add({
      summary: "Cannot be copied.",
      detail: "Select and copy manually.",
      severity: "warn",
      life: notificationConfig.LIFE,
    });
  }
};

const title = computed<string>(() => {
  if (authUser.value !== null && authUser.value.id === props.user.id) {
    return "Share your profile";
  } else {
    return `Share ${props.user.firstName}'s profile`;
  }
});
</script>
