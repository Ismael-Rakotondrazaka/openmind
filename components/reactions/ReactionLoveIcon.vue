<template>
  <i
    class="text-white pi pi-heart-fill bg-red-600 rounded-full border-2 border-white"
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

  /* eslint-disable indent */
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
  /* eslint-enable indent */

  return result;
});

const paddingClass = computed<string>(() => {
  let result = "p-2";

  /* eslint-disable indent */
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
  /* eslint-enable indent */

  return result;
});
</script>
