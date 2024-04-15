<template>
  <PrimeButton
    label="Following"
    icon="pi pi-chevron-down"
    severity="secondary"
    outlined
    @click="onDeleteFollowingHandler"
  />
</template>

<script setup lang="ts">
interface FollowingButtonProps {
  follow: FollowFull;
}

const props = defineProps<FollowingButtonProps>();

type FollowingButtonEmits = {
  "follows:destroy": [Follow];
};

const emit = defineEmits<FollowingButtonEmits>();

const toast = useToast();

const {
  follow,
  execute: destroyFollow,
  error,
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

<style scoped></style>
