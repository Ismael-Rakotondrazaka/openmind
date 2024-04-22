<template>
  <div
    class="p-4"
    @pointerenter="onMouseEnterEventHandler"
    @pointerleave="onMouseLeaveEventHandler"
  >
    <div class="text-center min-w-40">
      <UserAvatar size="xlarge" :user="user" preview class="mb-3" />

      <h1 class="mb-2 font-extrabold leading-tight text-text dark:text-white">
        {{ user.firstName }} {{ user.name }}
      </h1>

      <h2 class="mb-4 text-sm text-text-secondary">{{ user.username }}</h2>

      <PrimeButton
        icon="pi pi-arrow-up-right"
        label="Visit Profile"
        size="small"
        @click="onVisitProfileHandler"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface UserProfilePreviewProps {
  user: User;
}

const props = defineProps<UserProfilePreviewProps>();

type UserProfilePreviewEmits = {
  "preview:hide": [];
};

const emit = defineEmits<UserProfilePreviewEmits>();

const { isPending, start, stop } = useTimeoutFn(
  () => {
    emit("preview:hide");
  },
  2000,
  {
    immediate: false,
  },
);

const onMouseEnterEventHandler = () => {
  if (isPending.value) {
    stop();
  }
};

const onMouseLeaveEventHandler = () => {
  start();
};

const onVisitProfileHandler = () => {
  navigateTo({
    name: "users-username",
    params: {
      username: props.user.username,
    },
  });
};
</script>

<style></style>
