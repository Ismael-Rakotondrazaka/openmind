<template>
  <PrimeButton
    icon="pi pi-share-alt"
    severity="secondary"
    label="Share"
    text
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex, flex-row flex-nowrap gap-3 w-[25rem]">
      <p class="font-medium text-900 block mb-2">Share this article</p>

      <PrimeInputGroup>
        <PrimeInputText :value="url" readonly />

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

interface ShareArticleButtonProps {
  url: string;
}

const props = defineProps<ShareArticleButtonProps>();
const clipboard = useClipboard();
const toast = useToast();

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const toggleOverLayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const onCopyHandler = async () => {
  try {
    await clipboard.copy(props.url);

    toast.add({
      summary: "Link copied.",
      severity: "info",
      life: 5000,
    });
  } catch (error) {
    toast.add({
      summary: "Cannot be copied.",
      detail: "Select and copy manually.",
      severity: "warn",
      life: 5000,
    });
  }
};
</script>
