<template>
  <div>
    <div>
      <InputLabel :label-for="id" :label="label" :tooltip-text="tooltipText" />

      <InputDescription :description="description" />
    </div>

    <div>
      <label
        :for="id"
        class="relative flex aspect-video w-full flex-row justify-center rounded-md border bg-[--surface-100] hover:cursor-pointer"
        :class="{
          'border-[--surface-300]': errorMessage === undefined,
          'border-danger': errorMessage !== undefined,
        }"
      >
        <input
          :id="id"
          ref="imageRef"
          type="file"
          class="hidden w-full file:mr-4 file:rounded-md file:border-0 file:bg-[#14b8a6] file:px-5 file:py-4 file:font-bold file:text-white hover:cursor-pointer hover:file:bg-[#0d9488]"
          :name="name"
          :accept="accept"
          @change="onImageChangeHandler"
        />

        <figure v-if="previewUrl !== undefined" class="h-full w-full">
          <img
            :src="previewUrl"
            alt=""
            class="aspect-video w-full rounded-md object-cover object-center"
          />
        </figure>

        <div
          class="absolute bottom-0 inline-block pb-16 pt-5 text-center"
          :class="{
            hidden: previewUrl !== undefined,
          }"
        >
          <p class="mb-5">Drag or click to upload.</p>

          <span
            class="p-button p-component p-button-primary p-button-sm p-button-label hover:cursor-pointer"
            >Upload</span
          >
        </div>
      </label>
    </div>

    <div class="flex flex-row flex-nowrap items-center justify-between gap-2">
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
  accept?: string;
  tooltipText?: string;
  description?: string;
}

const props = withDefaults(defineProps<ImageInputProps>(), {
  accept: "",
  errorMessage: undefined,
  initialUrl: undefined,
  tooltipText: undefined,
  description: undefined,
});

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
