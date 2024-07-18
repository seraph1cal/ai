<template>
  <div class="icon-box">
    <el-input v-model="inputValue" placeholder="搜索图标" size="large" :prefix-icon="Icons.Search" />
    <div v-if="Object.keys(iconsList).length" class="icon-container">
      <div class="icon-list">
        <div v-for="item in iconsList" :key="item" class="icon-item">
          <svg-icon :name="item"></svg-icon>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="未搜索到您要找的图标~" />
  </div>
</template>

<script setup lang="ts" name="home">
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ref, computed } from 'vue';
import { svgIcons } from './svgIcons';
import * as Icons from '@element-plus/icons-vue';

const inputValue = ref('');

const customIcons: { [key: string]: any } = svgIcons();

const iconsList = computed((): { [key: string]: any } => {
  console.log(customIcons, 'customIcons');

  if (!inputValue.value) return svgIcons();
  let result: string[] = [];
  customIcons.forEach(item => {
    if (item.toLowerCase().indexOf(inputValue.value.toLowerCase()) > -1) result.push(item);
  });
  return result;
});
</script>

<style scoped lang="scss">
.icon-box {
  .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--el-text-color-regular);
  }
  .icon-container {
    background-color: #fff;
    padding: 5px;
    .icon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 125px);
      place-items: center;
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 42px;
        // padding: 20px 30px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.3);
        }
        span {
          margin-top: 5px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
}
</style>
