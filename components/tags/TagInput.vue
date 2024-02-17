<template>
  <div>
    <InputLabel
      label-for="tags"
      label="Tags"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <InputDescription :description="description" />

    <PrimeAutoComplete
      id="tags"
      v-model="tags"
      option-label="value"
      multiple
      :suggestions="suggestedTags"
      :pt="{
        container: 'w-full',
      }"
      :class="{ 'p-invalid': haveError }"
      @update:model-value="
        () => {
          searchTag = '';
        }
      "
      @complete="search"
    />

    <small id="tags-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script setup lang="ts">
import { type AutoCompleteCompleteEvent } from "primevue/autocomplete";

const tags = defineModel<Tag[]>("tags");

interface TagInputProps {
  errorMessage?: string;
  description?: string;
  tooltipText?: string;
}

const props = defineProps<TagInputProps>();

const searchTag = ref<string>("");

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const selectedExistedTagIds = computed<number[]>(() => {
  let result: number[] = [];

  if (tags.value !== undefined) {
    result = tags.value.reduce((previous: number[], current: Tag) => {
      if (current.id !== -1) {
        return previous.concat(current.id);
      } else {
        return previous;
      }
    }, []);
  }

  return result;
});

const { data: rawSuggestedTags }: { data: Ref<IndexTagData["tags"] | null> } =
  useFetch("/api/tags", {
    transform: (data): IndexTagData["tags"] =>
      IndexTagDataSchema.parse(data).tags,
    watch: [searchTag],
    immediate: false,
    query: {
      where: {
        value: {
          startsWith: searchTag,
        },
        id: {
          not: {
            in: selectedExistedTagIds,
          },
        },
      },
    },
  });

const suggestedTags = computed<Tag[]>(() => {
  let result: Tag[] = [];

  if (rawSuggestedTags.value !== null) {
    const formatted: string = searchTag.value
      .toLowerCase()
      .replaceAll(/\W+/g, " ");
    const isSearchTagNotSelected: boolean =
      tags.value?.find((tag: Tag) => tag.value === formatted) === undefined;
    const isSearchTagSelectedValid: boolean =
      formatted.length <= tagConfig.VALUE_MAX_LENGTH && formatted !== "";
    const isRawSuggestedTagsEmpty: boolean =
      rawSuggestedTags.value.length === 0;
    const isRawSuggestedTagsNotEmpty: boolean = !isRawSuggestedTagsEmpty;
    const isFirstRawSuggestedTagsNotEqualToSearch: boolean =
      isRawSuggestedTagsNotEmpty &&
      rawSuggestedTags.value[0].value !== searchTag.value.toLowerCase();

    if (
      isSearchTagSelectedValid &&
      isSearchTagNotSelected &&
      (isRawSuggestedTagsEmpty ||
        (isRawSuggestedTagsNotEmpty && isFirstRawSuggestedTagsNotEqualToSearch))
    ) {
      result = [
        {
          id: -1,
          value: searchTag.value,
        },
      ].concat(rawSuggestedTags.value);
    } else {
      result = [...rawSuggestedTags.value];
    }
  }

  return result;
});

const search = (event: AutoCompleteCompleteEvent) => {
  searchTag.value = event.query.trim();
};
</script>
