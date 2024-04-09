<template>
  <PrimeAvatar
    v-if="user.profileUrl === null"
    :label="firstInitial"
    :size="size"
    shape="circle"
  />
  <PrimeAvatar v-else :image="user.profileUrl" :size="size" shape="circle" />
</template>

<script lang="ts" setup>
interface UserAvatarProps {
  user: User;
  size: "normal" | "large" | "xlarge";
}

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: "normal",
});

const firstInitial = computed<string>(() =>
  props.user.firstName[0].toUpperCase(),
);
</script>
