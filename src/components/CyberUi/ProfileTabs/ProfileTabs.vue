<template>
  <div class="tabs-container">
    <div class="tabs">
      <el-tabs v-model="activeName" v-bind="filterAttrs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <template #label>
            <span class="tab-label">{{ tab.label }}</span>
          </template>
          <slot :name="tab.name"> </slot>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts" name="">
import { ref, useAttrs, computed } from 'vue';
interface TabsType {
  name: string;
  label: string;
}

const attrs = useAttrs();

const filterAttrs = computed(() => {
  const { style, ...rest } = attrs;
  return rest;
});

defineOptions({
  name: 'ProfileTabs'
});

const { tabs } = defineProps<{
  tabs: TabsType[];
}>();

const activeName = ref(tabs[0]?.name);
</script>
<style scoped lang="scss">
.tabs-container {
  padding-top: 15px;

  .tabs {
    position: relative;
    // box-shadow: 0px 15px 20px 0px rgba(52, 56, 106, 0.1);
    // border-radius: 4px;
    border: none;

    :deep(.el-tabs__item) {
      .tab-label {
        font-family: Microsoft YaHei;
        letter-spacing: 0px;
        border: solid 1px #e6ebff;
        background-color: #fff;
        padding: 0 15px;
        border-radius: 2px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        color: rgb(111, 111, 168);
        height: 30px;
      }
    }
    :deep(.el-tabs__item.is-active) {
      .tab-label {
        color: var(--el-color-primary);
      }
    }

    :deep(.el-tabs__header) {
      position: absolute;
      top: -20px;
      right: 50%;
      transform: translateX(50%);
      z-index: 999;
    }
    :deep(.el-tabs__content) {
      position: relative;
      background-color: #ffffff;
      -webkit-box-shadow: 0px 0px 20px 0px rgba(52, 56, 106, 0.06);
      box-shadow: 0px 0px 20px 0px rgba(52, 56, 106, 0.06);
      border-radius: 4px;
      border: solid 1px #e6ebff;
      padding: 30px 20px 20px;
    }

    :deep(.el-tabs__active-bar) {
      display: none;
    }
  }
}
</style>
