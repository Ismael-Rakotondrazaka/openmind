<template>
  <i
    class="pi pi-heart-fill rounded-full border-2 border-white bg-red-600 text-white"
    :class="[paddingClass, fontSizeClass]"
  ></i>
</template>

<script lang="ts" setup>
interface LikeIconProps {
  size?: "small" | "normal" | "large" | "xlarge";
}

const props = withDefaults(defineProps<LikeIconProps>(), {
  size: "normal",
});

const fontSizeClass = computed<string>(() => {
  let result = "text-md";

  switch (props.size) {
    case "small":
      result = "text-xs";
      break;

    case "large":
      result = "text-lg";
      break;

    case "xlarge":
      result = "text-2xl";
      break;
  }

  return result;
});

const paddingClass = computed<string>(() => {
  let result = "p-2";

  switch (props.size) {
    case "small":
      result = "p-1";
      break;

    case "large":
      result = "p-3";
      break;

    case "xlarge":
      result = "p-5";
      break;
  }

  return result;
});
</script>
