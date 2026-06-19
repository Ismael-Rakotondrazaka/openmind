<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import { refDebounced } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import { tagListQuery } from '@/features/shared/tags/tag.query';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    ariaInvalid?: boolean;
    modelValue: string[];
    placeholder?: string;
  }>(),
  {
    ariaInvalid: false,
    placeholder: undefined,
  }
);

const computedPlaceholder = computed(
  () => props.placeholder || t('common.search.placeholderTags')
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const inputValue = ref('');
const debouncedInput = refDebounced(inputValue, 300);
const isOpen = ref(false);

const { data: tagData, isLoading } = useQuery(() =>
  tagListQuery({
    pageSize: 10,
    search: debouncedInput.value || undefined,
  })
);

const suggestions = computed(() => {
  if (!debouncedInput.value) return [];
  const added = new Set(props.modelValue.map(t => t.toLowerCase()));
  return (tagData.value?.data ?? [])
    .map(t => t.value)
    .filter(v => !added.has(v.toLowerCase()));
});

const prevLength = ref(props.modelValue.length);
watch(
  () => props.modelValue.length,
  newLen => {
    if (newLen > prevLength.value) {
      inputValue.value = '';
      isOpen.value = false;
    }
    prevLength.value = newLen;
  }
);

const handleInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  inputValue.value = val;
  isOpen.value = val.length >= 1;
};

const handleFocus = () => {
  if (inputValue.value.length >= 1) isOpen.value = true;
};

const handleBlur = () => {
  isOpen.value = false;
};

const addSuggestion = (value: string) => {
  const alreadyAdded = props.modelValue.some(
    t => t.toLowerCase() === value.toLowerCase()
  );
  if (!alreadyAdded) {
    emit('update:modelValue', [...props.modelValue, value]);
  }
  inputValue.value = '';
  isOpen.value = false;
};
</script>

<template>
  <div class="relative">
    <TagsInput
      :model-value="modelValue"
      :aria-invalid="ariaInvalid"
      class="min-h-10"
      @update:model-value="emit('update:modelValue', ($event as string[]))"
    >
      <TagsInputItem v-for="tag in modelValue" :key="tag" :value="tag">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput
        :placeholder="computedPlaceholder"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />
    </TagsInput>

    <div
      v-if="isOpen"
      class="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border shadow-md"
    >
      <p v-if="isLoading" class="text-muted-foreground px-3 py-2 text-sm">
        {{ t('loading.searching') }}
      </p>
      <p
        v-else-if="suggestions.length === 0"
        class="text-muted-foreground px-3 py-2 text-sm"
      >
        {{ t('tags.noMatching') }}
      </p>
      <template v-else>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="hover:bg-accent flex w-full items-center px-3 py-1.5 text-sm"
          @mousedown.prevent="addSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </template>
    </div>
  </div>
</template>
