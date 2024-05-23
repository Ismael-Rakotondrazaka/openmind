<template>
  <PrimeButton
    icon="pi pi-user-plus"
    :label="label"
    :loading="isStatusPending"
    @click="onStoreFollowHandler"
  />
</template>

<script setup lang="ts">
interface FollowButtonProps {
  user: UserFull;
  isMin?: boolean;
}

const props = withDefaults(defineProps<FollowButtonProps>(), {
  isMin: false,
});

type FollowButtonEmits = {
  "follows:store": [FollowFull];
};

const emit = defineEmits<FollowButtonEmits>();

const toast = useToast();

const label = computed(() => (props.isMin ? undefined : "Follow"));

const {
  followFull: newFollow,
  execute: storeFollow,
  error,
  isStatusPending,
} = useStoreFollow({
  body: () => ({
    userId: props.user.id,
  }),
});

const onStoreFollowHandler = async () => {
  await storeFollow();

  if (newFollow.value !== null) {
    emit("follows:store", newFollow.value);

    toast.add({
      life: notificationConfig.LIFE,
      summary: "New Following",
      detail: `You are now following ${newFollow.value.following.firstName}`,
      severity: "success",
    });
  } else if (error.value !== null) {
    toast.add({
      life: notificationConfig.LIFE,
      summary: error.value.message,
      severity: "error",
    });
  }
};
</script>
