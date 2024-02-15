<template>
  <div>
    <label for="cover">Cover</label>

    <div class="flex gap-2 flex-nowrap flex-row items-center justify-between">
      <input
        id="cover"
        ref="coverRef"
        type="file"
        class="block w-full file:mr-4 file:py-4 file:px-5 file:rounded-md file:border-0 file:font-bold file:bg-[#14b8a6] file:text-white hover:file:bg-[#0d9488] hover:cursor-pointer"
        name="cover"
        @change="onCoverChangeHandler"
      />

      <div>
        <PrimeButton
          severity="danger"
          outlined
          :disabled="isResetButtonDisabled"
          @click.prevent="resetCoverInputFiles"
          >Remove</PrimeButton
        >
      </div>
    </div>

    <small id="cover-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const cover = defineModel<File | null, string>("cover");

defineProps({
  errorMessage: {
    type: String,
    required: false,
    default: undefined,
  },
});

const isResetButtonDisabled = computed<boolean>(
  () => !(cover.value instanceof File),
);

const onCoverChangeHandler = (event: Event) => {
  const target: HTMLInputElement | null =
    event.target as HTMLInputElement | null;
  if (target === null) return;

  const files: FileList | null = target.files;
  if (files === null) return;

  const file: File | null = files.item(0);
  if (file === null) return;

  cover.value = file;
};

const coverRef: Ref<HTMLInputElement | null> = ref(null);

const resetCoverInputFiles = () => {
  if (coverRef.value !== null) {
    coverRef.value.files = new DataTransfer().files;
  }

  cover.value = null;
};

onMounted(() => {
  resetCoverInputFiles();
});
</script>
