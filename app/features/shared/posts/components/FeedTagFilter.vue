<script lang="ts" setup>
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetTags } from '~/features/shared/tags/composables/useGetTags';

interface Props {
  modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const isOpen = ref(false);
const tagSearch = ref('');

const { data: tagsData } = useGetTags(() => ({ limit: 100 }));
const allTags = computed(() => tagsData.value?.data ?? []);

const filteredTags = computed(() => {
  const search = tagSearch.value.toLowerCase();
  if (!search) return allTags.value;
  return allTags.value.filter(t => t.value.toLowerCase().includes(search));
});

const selectedTags = computed(() =>
  allTags.value.filter(t => props.modelValue.includes(t.id))
);

function isSelected(tagId: string) {
  return props.modelValue.includes(tagId);
}

function removeTag(tagId: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter(id => id !== tagId)
  );
}

function toggleTag(tagId: string) {
  if (isSelected(tagId)) {
    emit(
      'update:modelValue',
      props.modelValue.filter(id => id !== tagId)
    );
  } else {
    emit('update:modelValue', [...props.modelValue, tagId]);
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button variant="outline" size="sm" class="gap-1.5">
          <Icon name="mdi:tag-outline" size="1rem" />
          Tags
          <Badge
            v-if="modelValue.length"
            variant="secondary"
            class="px-1.5 py-0 text-xs"
          >
            {{ modelValue.length }}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-56 p-2" align="start">
        <Input
          v-model="tagSearch"
          placeholder="Search tags..."
          class="mb-2 h-8 text-sm"
        />
        <div class="max-h-48 overflow-y-auto">
          <p
            v-if="filteredTags.length === 0"
            class="text-muted-foreground py-3 text-center text-sm"
          >
            No tags found.
          </p>
          <button
            v-for="tag in filteredTags"
            :key="tag.id"
            type="button"
            class="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm"
            @click="toggleTag(tag.id)"
          >
            <Icon
              name="mdi:check"
              size="0.875rem"
              :class="isSelected(tag.id) ? 'opacity-100' : 'opacity-0'"
            />
            {{ tag.value }}
          </button>
        </div>
      </PopoverContent>
    </Popover>

    <Badge
      v-for="tag in selectedTags"
      :key="tag.id"
      variant="secondary"
      class="gap-1 pr-1"
    >
      {{ tag.value }}
      <button
        type="button"
        class="hover:text-destructive ml-0.5 rounded"
        @click="removeTag(tag.id)"
      >
        <Icon name="mdi:close" size="0.75rem" />
      </button>
    </Badge>
  </div>
</template>
