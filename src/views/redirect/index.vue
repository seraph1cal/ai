<template><div></div></template>
<script setup lang="ts" name="">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmbedStore } from '@/stores/modules/embed';

const { toggleEmbed } = useEmbedStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const { path } = route.params;
  toggleEmbed(true);
  router.replace({ path: '/' + path, query: route.query });
});
</script>
