<template>
  <div class="mx-auto w-full max-w-[700px]">
    <IndexArticle />

    <Teleport to="body">
      <NuxtLink
        :to="{
          name: 'articles-create',
        }"
      >
        <PrimeButton
          label="New article"
          icon="pi pi-plus"
          :pt="{
            root: {
              class: 'fixed bottom-5 right-24',
            },
          }"
        />
      </NuxtLink>
    </Teleport>
  </div>
</template>

<script setup lang="ts"></script>
