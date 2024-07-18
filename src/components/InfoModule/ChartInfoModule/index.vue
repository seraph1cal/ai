<template>
  <div class="chart-info-module">
    <div class="module-title">
      <span class="title-icon"></span>
      <span class="title-name">{{ title }}</span>
    </div>
    <ECharts style="border: 1px solid #cccccc" :option="chartOption" :width="width" :height="height" />
  </div>
</template>

<script setup lang="ts" name="ChartInfoModule">
import { ECOption } from '@/components/ECharts/config';
import ECharts from '@/components/ECharts/index.vue';

interface Props {
  title: string;
  chartOption: ECOption;
  width?: string;
  height?: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@import 'index';
</style>
