<template>
  <ConfirmDialog
    v-model:is-visible="isVisible"
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

<script lang="ts" setup>
interface DestroyFollowFormProps {
  follow: FollowFull;
}

const props = defineProps<DestroyFollowFormProps>();

const isVisible = defineModel<boolean>("isVisible", {
  required: false,
  default: false,
});

type DestroyFollowFormEmits = {
  "follows:destroy": [Follow];
};

const emit = defineEmits<DestroyFollowFormEmits>();

const toast = useToast();

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

const {
  follow,
  execute: destroyFollow,
  error,
  isStatusPending,
} = useDestroyFollow({
  followId: () => props.follow.id,
});

const onDialogRejectedHandler = () => {
  isVisible.value = false;
};

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

<style></style>
