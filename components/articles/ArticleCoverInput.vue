<template>
  <div>
    <label for="cover">Cover</label>

    <div>
      <label
        for="cover"
        class="w-full hover:cursor-pointer aspect-video bg-[--surface-100] rounded-md flex flex-row justify-center relative"
      >
        <input
          id="cover"
          ref="coverRef"
          type="file"
          class="hidden w-full file:mr-4 file:py-4 file:px-5 file:rounded-md file:border-0 file:font-bold file:bg-[#14b8a6] file:text-white hover:file:bg-[#0d9488] hover:cursor-pointer"
          name="cover"
          @change="onCoverChangeHandler"
        />

        <figure v-if="previewUrl !== undefined" class="w-full h-full">
          <img
            :src="previewUrl"
            alt=""
            class="object-cover w-full aspect-video rounded-md object-center"
          />
        </figure>

        <div
          class="absolute inline-block bottom-0 pt-5 pb-16 text-center"
          :class="{
            hidden: previewUrl !== undefined,
          }"
        >
          <p class="mb-5">Drag or click to upload.</p>

          <span
            class="p-button hover:cursor-pointer p-component p-button-primary p-button-sm p-button-label"
            >Upload</span
          >
        </div>
      </label>
    </div>

    <div class="flex gap-2 flex-nowrap flex-row items-center justify-between">
      <div>
        <PrimeButton
          severity="danger"
          outlined
          :disabled="isRemoveButtonDisabled"
          icon="pi pi-trash"
          label="Remove"
          @click.prevent="onRemoveHandler"
        />
      </div>
    </div>

    <small id="cover-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
/**
cover can be in 3 different state:\
`File`: modified with a file\
`null`: deleted (also considered as modified)\
`undefined`: not modified at all
 */
const cover = defineModel<File | null | undefined, string>("cover", {
  required: true,
});

interface ArticleCoverInputProps {
  errorMessage?: string;
  initialUrl?: string;
}
const props = defineProps<ArticleCoverInputProps>();

const canShowPreview = ref<boolean>(props.initialUrl !== undefined);

const isRemoveButtonDisabled = computed<boolean>(() => !canShowPreview.value);

const onCoverChangeHandler = (event: Event) => {
  const target: HTMLInputElement | null =
    event.target as HTMLInputElement | null;
  if (target === null) return;

  const files: FileList | null = target.files;
  if (files === null) return;

  const file: File | null = files.item(0);
  if (file === null) return;

  cover.value = file;
  canShowPreview.value = true;
};

const coverRef: Ref<HTMLInputElement | null> = ref(null);

const onRemoveHandler = () => {
  const isCoverModified: boolean =
    props.initialUrl !== undefined && cover.value instanceof File;

  if (isCoverModified) {
    canShowPreview.value = true;
    cover.value = undefined;
  } else {
    // the cover is completely deleted
    canShowPreview.value = false;
    cover.value = null;
  }

  resetCoverInputFiles();
};

const resetCoverInputFiles = () => {
  if (coverRef.value !== null) {
    coverRef.value.files = new DataTransfer().files;
  }
};

const previewUrl = computed<string | undefined>(() => {
  let result: string | undefined;

  if (canShowPreview.value) {
    result = props.initialUrl;

    if (cover.value instanceof File) {
      result = URL.createObjectURL(cover.value);
    }
  }

  return result;
});

onMounted(() => {
  resetCoverInputFiles();
});
</script>
