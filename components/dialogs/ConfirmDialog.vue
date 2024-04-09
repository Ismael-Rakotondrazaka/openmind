<template>
  <PrimeDialog
    v-model:visible="isVisible"
    modal
    :draggable="false"
    :closable="false"
    :pt="{
      root: {
        class: 'max-w-[700px]',
      },
    }"
  >
    <template #container>
      <div class="bg-[--surface-0] rounded-lg" @click.stop="">
        <ConfirmDialogHeader :content="header" :severity="severity" />

        <div class="px-5 pb-5">
          <p class="mb-0 whitespace-pre-wrap text-text">{{ message }}</p>

          <DialogInfoList
            :informations="infoList"
            :severity="severity"
            class="mt-3"
          />
        </div>

        <div class="flex items-center gap-3 px-5 pb-5 mt-4">
          <PrimeButton
            :label="resolveButtonLabel"
            :severity="severity"
            @click="onResolveHandler"
          ></PrimeButton>

          <PrimeButton
            :label="rejectButtonLabel"
            outlined
            severity="secondary"
            @click="onRejectHandler"
          ></PrimeButton>
        </div>
      </div>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
interface IConfirmDialogProps {
  header: string;
  message: string;
  infoList?: string[];
  resolveButtonLabel: string;
  rejectButtonLabel: string;
  severity?: Severity;
}

withDefaults(defineProps<IConfirmDialogProps>(), {
  infoList: () => [],
  severity: "primary",
});

const isVisible = defineModel<boolean>("isVisible", {
  required: true,
});

type IConfirmDialogEmits = {
  "dialog:resolved": [];
  "dialog:rejected": [];
};

const emit = defineEmits<IConfirmDialogEmits>();

const onResolveHandler = () => {
  isVisible.value = false;
  emit("dialog:resolved");
};

const onRejectHandler = () => {
  isVisible.value = false;
  emit("dialog:rejected");
};
</script>
