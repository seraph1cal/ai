<template>
  <div class="graph-info-module">
    <div class="module-title">
      <span class="title-icon"></span>
      <span class="title-name">{{ title }}</span>
    </div>
    <div class="module-content" :id="graphInfoModuleId" ref="graphInstanceRef" :style="{ width, height }"></div>
  </div>
</template>

<script setup lang="ts" name="GraphInfoModule">
import { registerGraphIconFontNode } from '@/utils/graphSettings/registerNode';
import { useGraphMapInstance } from '@/hooks/useGraphMap';
import { ref, onMounted, nextTick } from 'vue';

interface Props {
  title: string;
  graphOption: any;
  width?: string;
  height?: string;
  graphInfoModuleId?: string;
}

const graphInstanceRef = ref();

const props = withDefaults(defineProps<Props>(), {
  graphInfoModuleId: 'graphInfoModuleId'
});

// 初始化
const initGraphMap = () => {
  if (graphInstanceRef.value) {
    nextTick(() => {
      const canvasWidth = graphInstanceRef.value.clientWidth;
      const canvasHeight = graphInstanceRef.value.clientHeight;
      registerGraphIconFontNode();
      useGraphMapInstance(props.graphOption, props.graphInfoModuleId, canvasWidth, canvasHeight);
    });
  }
};

onMounted(() => {
  initGraphMap();
});
</script>

<style scoped lang="scss">
@import 'index';
</style>
