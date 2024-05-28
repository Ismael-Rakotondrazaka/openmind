<template>
  <div class="mx-auto w-full max-w-[700px]">
    <PageTitle>Articles</PageTitle>

    <IndexArticle />

    <Teleport to="body">
      <div
        class="fixed bottom-5 z-[10] flex w-full flex-row items-center justify-center md:justify-end"
      >
        <NuxtLink
          :to="{
            name: 'articles-create',
          }"
        >
          <PrimeButton
            icon="pi pi-plus"
            :pt="{
              root: {
                class: 'md:hidden',
              },
            }"
            rounded
          />

          <PrimeButton
            label="New article"
            icon="pi pi-plus"
            :pt="{
              root: {
                class: 'mr-24 hidden md:block',
              },
            }"
          />
        </NuxtLink>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent("NuxtSeo");
</script>
