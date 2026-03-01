<template>
  <main class="min-h-svh" style="padding: 16px; font-family: sans-serif">
    <h1>useGetUsernames Debug Page</h1>

    <div style="display: flex; gap: 8px; margin: 12px 0; align-items: end">
      <label style="display: flex; flex-direction: column; gap: 4px">
        Username
        <input v-model="username" type="text" placeholder="username" />
      </label>

      <label style="display: flex; flex-direction: column; gap: 4px">
        Limit
        <input v-model.number="limit" type="number" min="1" />
      </label>

      <button type="button" @click="runQuery">Run query</button>
      <button type="button" @click="clear">Clear</button>
    </div>

    <p><strong>Status:</strong> {{ status }}</p>
    <p v-if="isFetching">Loading...</p>
    <p v-if="hasError" style="color: #b00020">Error: {{ errorMessage }}</p>

    <pre style="background: #f4f4f4; padding: 12px">{{ formattedData }}</pre>
  </main>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { useGetUsernames } from '~/features/auth/composables/useGetUsernames';

const username = ref('');
const limit = ref(5);

const params = reactive({
  limit: limit.value,
  username: username.value,
});

const query = useGetUsernames(params);

onServerPrefetch(async () => {
  await query.suspense();
});

const status = computed(() => query.status.value);
const isFetching = computed(() => query.isFetching.value);
const hasError = computed(() => Boolean(query.error.value));
const errorMessage = computed(() => {
  const err = query.error.value;
  if (!err) return '';

  if (err instanceof Error) {
    return err.message;
  }

  return String(err);
});
const formattedData = computed(() =>
  JSON.stringify(query.data.value ?? { count: 0, data: [] }, null, 2)
);

const runQuery = async () => {
  params.username = username.value.trim();
  params.limit = limit.value;
  await query.refetch();
};

const clear = () => {
  username.value = '';
  limit.value = 5;
  params.username = '';
  params.limit = 5;
};
</script>
