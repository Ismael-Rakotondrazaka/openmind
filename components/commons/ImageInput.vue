<template>
  <div>
    <label :for="id">{{ label }}</label>

    <div>
      <label
        :for="id"
        class="w-full hover:cursor-pointer aspect-video bg-[--surface-100] rounded-md flex flex-row justify-center relative"
      >
        <input
          :id="id"
          ref="imageRef"
          type="file"
          class="hidden w-full file:mr-4 file:py-4 file:px-5 file:rounded-md file:border-0 file:font-bold file:bg-[#14b8a6] file:text-white hover:file:bg-[#0d9488] hover:cursor-pointer"
          :name="name"
          @change="onImageChangeHandler"
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

    <small id="image-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
/**
image can be in 3 different state:\
`File`: modified with a file\
`null`: deleted (also considered as modified)\
`undefined`: not modified at all
 */
const image = defineModel<File | null | undefined, string>("image", {
  required: true,
});

interface ImageInputProps {
  errorMessage?: string;
  initialUrl?: string;
  label: string;
  name: string;
  id: string;
}
const props = defineProps<ImageInputProps>();

const canShowPreview = ref<boolean>(props.initialUrl !== undefined);

const isRemoveButtonDisabled = computed<boolean>(() => !canShowPreview.value);

const onImageChangeHandler = (event: Event) => {
  const target: HTMLInputElement | null =
    event.target as HTMLInputElement | null;
  if (target === null) return;

  const files: FileList | null = target.files;
  if (files === null) return;

  const file: File | null = files.item(0);
  if (file === null) return;

  image.value = file;
  canShowPreview.value = true;
};

const imageRef: Ref<HTMLInputElement | null> = ref(null);

const resetImageInputFiles = () => {
  if (imageRef.value !== null) {
    imageRef.value.files = new DataTransfer().files;
  }
};

const onRemoveHandler = () => {
  const isImageModified: boolean =
    props.initialUrl !== undefined && image.value instanceof File;

  if (isImageModified) {
    canShowPreview.value = true;
    image.value = undefined;
  } else {
    // the image is completely deleted
    canShowPreview.value = false;
    image.value = null;
  }

  resetImageInputFiles();
};

const previewUrl = computed<string | undefined>(() => {
  let result: string | undefined;

  if (canShowPreview.value) {
    result = props.initialUrl;

    if (image.value instanceof File) {
      result = URL.createObjectURL(image.value);
    }
  }

  return result;
});

onMounted(() => {
  resetImageInputFiles();
});
</script>
