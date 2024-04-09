<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="line-clamp-3," :style="contentStyle" v-html="content"></div>
    <PrimeButton
      :label="label"
      text
      :pt="{
        root: {
          class: 'p-0 mt-2',
        },
      }"
      severity="secondary"
      @click="onToggleCollapsedHandler"
    />
  </div>
</template>

<script lang="ts" setup>
interface ContentFormatterProps {
  content: string;
  lineClamp?: number;
}

const props = withDefaults(defineProps<ContentFormatterProps>(), {
  lineClamp: -1,
  isCollapsed: false,
});

const isCollapsed = defineModel<boolean>("isCollapsed", {
  default: false,
});

const label = computed<string>(() => {
  const isCollapsedLabels = {
    collapsed: "Show more",
    notCollapsed: "Show less",
  };

  /* eslint-disable indent */
  switch (isCollapsed.value) {
    case true:
      return isCollapsedLabels.collapsed;

    default:
      return isCollapsedLabels.notCollapsed;
  }
  /* eslint-enable indent */
});

const onToggleCollapsedHandler = () => {
  isCollapsed.value = !isCollapsed.value;
};

const contentStyle = computed(() => {
  const result: Record<string, string> = {};

  if (isCollapsed.value) {
    result.overflow = "hidden";
    result.display = "-webkit-box";
    result["-webkit-box-orient"] = "vertical";
    result["-webkit-line-clamp"] = `${props.lineClamp}`;
  }

  return result;
});
</script>
