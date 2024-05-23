<template>
  <PrimeDialog
    v-model:visible="isVisible"
    modal
    :draggable="false"
    :closable="isClosable"
    :pt="{
      root: {
        class: 'max-w-[700px]',
      },
    }"
    :position="position"
  >
    <template #header>
      <ConfirmDialogHeader
        :icon-type="iconType"
        :content="header"
        :severity="severity"
      />
    </template>

    <template #default>
      <p class="mb-0 whitespace-pre-wrap text-text">{{ message }}</p>

      <DialogInfoList
        :informations="infoList"
        :severity="severity"
        class="mt-3"
      />
    </template>

    <template v-if="haveButtons" #footer>
      <div class="flex items-center gap-3">
        <PrimeButton
          v-if="haveResolveButton"
          :label="resolveButtonLabel"
          :severity="severity"
          :loading="isLoading"
          @click="onResolveHandler"
        ></PrimeButton>

        <PrimeButton
          v-if="haveRejectButton"
          :label="rejectButtonLabel"
          outlined
          severity="secondary"
          @click="onRejectHandler"
        ></PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
type IconType = "question" | "check" | "info";

interface IConfirmDialogProps {
  header: string;
  message: string;
  infoList?: string[];
  resolveButtonLabel?: string;
  rejectButtonLabel?: string;
  severity?: Severity;
  isLoading?: boolean;
  iconType?: IconType;
  isClosable?: boolean;
}

const props = withDefaults(defineProps<IConfirmDialogProps>(), {
  infoList: () => [],
  isLoading: false,
  severity: "primary",
  resolveButtonLabel: undefined,
  rejectButtonLabel: undefined,
  iconType: undefined,
  isClosable: false,
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

const { width } = useWindowSize();
const position = computed(() => (width.value > 767 ? "center" : "bottom"));

const onRejectHandler = () => {
  isVisible.value = false;
  emit("dialog:rejected");
};

const haveResolveButton = computed<boolean>(
  () => props.resolveButtonLabel !== undefined,
);
const haveRejectButton = computed<boolean>(
  () => props.rejectButtonLabel !== undefined,
);
const haveButtons = computed<boolean>(
  () => haveResolveButton.value || haveRejectButton.value,
);
</script>
