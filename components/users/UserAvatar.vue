<template>
  <PrimeAvatar
    v-if="user.profileUrl === null"
    :label="firstInitial"
    shape="circle"
    :pt="{
      root: {
        class: [previewClass],
      },
    }"
  />
  <PrimeImage
    v-else-if="preview"
    :src="user.profileUrl"
    alt=""
    :image-class="['object-cover rounded-full aspect-square', previewClass]"
    preview
  />
  <PrimeAvatar
    v-else
    :image="user.profileUrl"
    :pt="{
      root: {
        class: [previewClass],
      },
    }"
    shape="circle"
  />
</template>

<script lang="ts" setup>
interface UserAvatarProps {
  user: User;
  size?: "normal" | "large" | "xlarge" | "2xlarge";
  preview?: boolean;
}

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: "normal",
  preview: false,
});

const firstInitial = computed<string>(() =>
  props.user.firstName[0].toUpperCase(),
);

const previewClass = computed<string>(() => {
  const sizePreviewClass: Record<
    "normal" | "large" | "xlarge" | "2xlarge",
    string
  > = {
    normal: "w-[2rem] h-[2rem] text-[1rem]",
    large: "w-[3rem] h-[3rem] text-[1.5rem]",
    xlarge: "w-[4rem] h-[4rem] text-[2rem]",
    "2xlarge": "w-[8rem] h-[8rem] text-[4rem]",
  };

  return sizePreviewClass[props.size];
});
</script>
