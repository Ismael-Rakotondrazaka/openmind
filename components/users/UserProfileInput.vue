<template>
  <ImageInput
    id="user-profile-input"
    v-model:image="profile"
    :error-message="errorMessage"
    :initial-url="initialUrl"
    :accept="accept"
    :tooltip-text="tooltipText"
    description="Upload a high-quality image that represents you. Ideal images are clear, well-lit, and centered on your face."
    label="Profile image"
    name="profile"
  />
</template>

<script lang="ts" setup>
/**
  profile can be in 3 different state:\
  `File`: modified with a file\
  `null`: deleted (also considered as modified)\
  `undefined`: not modified at all
   */
const profile = defineModel<File | null | undefined, string>("profile", {
  required: true,
});

interface UserProfileInputProps {
  errorMessage?: string;
  initialUrl?: string;
}

defineProps<UserProfileInputProps>();

const accept = computed<string>(() => userProfileConfig.MIME_TYPES.join(","));

const tooltipText = computed<string>(() => {
  const size: number = Math.floor(userProfileConfig.MAX_SIZE / 1000000);

  return `Upload an image\n• (PNG, JPEG, WebP, JPG, SVG)\n• ${size}Mb max`;
});
</script>
