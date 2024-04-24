<template>
  <PrimeButton
    v-if="haveOptions"
    icon="pi pi-ellipsis-h"
    text
    size="small"
    severity="secondary"
    :pt="{
      root: {
        class: 'px-1 py-0 w-[unset]',
      },
    }"
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex flex-col gap-3 flex-nowrap">
      <PrimeButton
        v-if="isProfileEditable"
        icon="pi pi-pencil"
        outlined
        severity="info"
        :pt="{
          root: {
            class: 'w-full',
          },
        }"
        label="Edit profile"
        @click="onEditHandler"
      />
    </div>
  </PrimeOverlayPanel>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface IUserProfileOptionsButtonProps {
  user: UserFull;
}

const props = defineProps<IUserProfileOptionsButtonProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const isProfileEditable = computed<boolean>(
  () => authUser.value !== null && props.user.id === authUser.value.id,
);

const haveOptions = computed<boolean>(() =>
  [isProfileEditable.value].includes(true),
);

const toggleOverLayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const onEditHandler = () => {
  navigateTo({
    name: "users-username-edit",
    params: {
      username: props.user.username,
    },
  });
};
</script>
