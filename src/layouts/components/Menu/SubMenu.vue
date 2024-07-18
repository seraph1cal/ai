<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
      <template #title>
        <svg-icon :name="subItem.meta.icon" v-if="subItem.meta.icon" :class="isCollapse ? 'ml-5' : 'mr-20'"></svg-icon>

        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
      <svg-icon :name="subItem.meta.icon" v-if="subItem.meta.icon" :class="[{ 'mr-20': !isCollapse }]"></svg-icon>

      <template #title>
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{ menuList: Menu.MenuOptions[] }>();
const globalStore = useGlobalStore();

const isCollapse = computed(() => globalStore.isCollapse);
const router = useRouter();
const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank');
  router.push(subItem.path);
};
</script>

<style lang="scss">
.el-menu-item,
.el-sub-menu__title,
.el-sub-menu .el-menu-item {
  height: 40px;
  background-color: #fafbff;
  &.is-active {
    color: var(--el-color-primary);
  }
}
.el-container .classic-content .el-aside .aside-box .el-menu {
  overflow: hidden;
}
.el-sub-menu .el-sub-menu__icon-arrow {
  right: -10px;
}
.el-menu-item .el-menu-tooltip__trigger {
  // left: -10px;
  padding: 0 0 0 15px !important;
}
.el-sub-menu .el-menu {
  background-color: #fafbff;
}

.el-menu-item [class^='el-icon'],
.el-sub-menu .el-icon {
  margin-right: 20px;
}
.el-sub-menu .el-menu-item {
  // padding-left: 65px !important;
  width: 71%;
  margin-left: 53px;
  padding-left: 10px !important;

  //dot
  &::before {
    position: absolute;
    top: 50%;
    width: 5px;
    left: -25px !important;
    border-radius: 50%;
    height: 5px;
    content: '';
    transform: translateY(-50%);
    background-color: #b9b9ac55;
  }
  &.is-active::before {
    background-color: var(--el-color-primary);
  }

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -23px !important;
    width: 1px;
    content: '';
    background-color: #b9b9ac33;
  }
  &:last-child::after {
    position: absolute;
    top: 0;
    bottom: 50%;
    left: -23px !important;
    width: 1px;
    content: '';
    background-color: #b9b9ac33;
  }
  &:first-child::after {
    position: absolute;
    top: 50%;
    bottom: 0;
    left: -23px !important;
    width: 1px;
    content: '';
    background-color: #b9b9ac33;
  }
}

.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: #fafbff !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      border-radius: 8px;
      color: #000 !important;
      background-color: #f4f6fd !important;
    }
  }
}

.el-sub-menu__title {
  padding: 0 10px;
}
.el-menu-item {
  &:hover {
    background-color: #fafbff;
  }
  &.is-active {
    border-radius: 8px;
    background-color: #f4f6fd !important;
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>
