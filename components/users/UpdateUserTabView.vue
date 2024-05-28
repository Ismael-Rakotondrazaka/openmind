<template>
  <PrimeTabView class="items-stretch">
    <PrimeTabPanel header="Main profile">
      <UpdateUserProfileTabContent :user="user" />
    </PrimeTabPanel>

    <PrimeTabPanel header="Tag preference">
      <UpdateUserTagTabContent />
    </PrimeTabPanel>
  </PrimeTabView>
</template>

<script lang="ts" setup>
interface UpdateUserTabViewProps {
  user: UserFull;
}

defineProps<UpdateUserTabViewProps>();
</script>

<style></style>
