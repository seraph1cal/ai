<template>
  <div class="myDrawer">
    <el-drawer v-bind="$attrs">
      <template v-for="item in Object.keys($slots)" #[item]="scope">
        <slot :name="item" v-bind="scope"></slot>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts" name="CyDrawer">
defineOptions({
  name: 'CyDrawer'
});
/* 
 给父组件添加样式 
 {
  position: relative;
  overflow: hidden; 
 }
*/
</script>
<style scoped lang="scss">
.myDrawer {
  :deep(.el-overlay) {
    position: absolute !important;
  }
  :deep(div:first-child) {
    position: absolute !important;
    z-index: 999;
  }
}
</style>
