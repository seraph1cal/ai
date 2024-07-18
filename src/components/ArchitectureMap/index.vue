<template>
  <!--架构导图-->
  <div class="architecture-map" :id="architectureMapId"></div>
</template>

<script setup lang="ts" name="ArchitectureMap">
import { onMounted } from 'vue';
import { useArchitectureMapInstance } from '@/hooks/useGraphMap';
import { GraphMap } from '@/hooks/interface';
import { registerArchitectureMapNode } from '@/utils/graphSettings/registerNode';

interface Props {
  mapData: GraphMap.MapData;
  architectureMapId: string;
}

const props = withDefaults(defineProps<Props>(), {
  architectureMapId: 'architectureMapId'
});

// 初始化
const initGraphMap = () => {
  registerArchitectureMapNode();
  useArchitectureMapInstance(props.mapData, props.architectureMapId, 540, 240);
};

onMounted(() => {
  initGraphMap();
});
</script>

<style scoped lang="scss">
.architecture-map {
  width: 100%;
  height: 100%;
}
</style>
