<template>
  <PrimeButton
    label="Following"
    icon="pi pi-chevron-down"
    severity="secondary"
    outlined
    @click="onOpenOverlayHandler"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex flex-col gap-5">
      <p class="text-text">
        Followed since
        <span class="font-bold">{{ formattedFollowingDate }}</span>
      </p>

      <PrimeButton
        outlined
        label="Unfollow"
        severity="danger"
        icon="pi pi-user-minus"
        @click="onOpenDialogHandler"
      />
    </div>
  </PrimeOverlayPanel>

  <ConfirmDialog
    v-model:is-visible="isDialogVisible"
    :header="dialogHeader"
    :message="dialogMessage"
    :info-list="infoList"
    resolve-button-label="Yes, Unfollow"
    reject-button-label="Cancel"
    severity="danger"
    :is-loading="isStatusPending"
    @dialog:resolved="onDeleteFollowingHandler"
    @dialog:rejected="onDialogRejectedHandler"
  />
</template>

<script setup lang="ts">
import type { PrimeOverlayPanel } from "#build/components";

interface FollowingButtonProps {
  follow: FollowFull;
}

const props = defineProps<FollowingButtonProps>();

type FollowingButtonEmits = {
  "follows:destroy": [Follow];
};

const emit = defineEmits<FollowingButtonEmits>();

const toast = useToast();

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const isDialogVisible = ref<boolean>(false);
const onOpenDialogHandler = () => {
  isDialogVisible.value = true;
};
const onDialogRejectedHandler = () => {
  isDialogVisible.value = false;
};

const onOpenOverlayHandler = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const dialogHeader = computed<string>(
  () => `Unfollow ${props.follow.following.username}`,
);
const dialogMessage = computed<string>(
  () => `Are you sure you want to unfollow ${props.follow.following.username}`,
);
const infoList = computed<string[]>(() => [
  `You will see less of ${props.follow.following.username}'s articles.`,
  "You still can visit this profile.",
]);

const formattedFollowingDate = useDateFormat(
  () => props.follow.createdAt,
  "MMMM, D YYYY",
);

const {
  follow,
  execute: destroyFollow,
  error,
  isStatusPending,
} = useDestroyFollow({
  followId: () => props.follow.id,
});

const onDeleteFollowingHandler = async () => {
  await destroyFollow();

  if (error.value === null) {
    emit("follows:destroy", follow.value!);

    toast.add({
      life: notificationConfig.LIFE,
      summary: "Unfollowed User",
      detail: `You have unfollowed ${props.follow.following.firstName}`,
      severity: "info",
    });
  } else {
    toast.add({
      life: notificationConfig.LIFE,
      summary: error.value.message,
      severity: "error",
    });
  }
};
</script>
