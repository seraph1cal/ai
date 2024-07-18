<template>
  <div style="white-space: nowrap" class="flex items-center justify-end mr-10">
    <template v-for="item in filterBtnList.slice(0, 3)" :key="item.prop">
      <el-tooltip :content="item.content" placement="top" :disabled="!item.content" :show-after="300">
        <el-button
          size="small"
          :type="TypeMap[item.prop]"
          @click="emit('btnClick', item.prop, row)"
          :disabled="item.isDisabled && item.isDisabled(row)"
          v-bind="item"
          plain
        >
          <svg-icon :name="getIcon(item.prop, item.iconName)" :icon-style="{ width: '14px', height: '14px' }"></svg-icon>
        </el-button>
      </el-tooltip>
    </template>
    <template v-if="filterBtnList.length > 3">
      <el-dropdown trigger="click">
        <span class="ml-10 cursor-pointer">
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in moreBtnList" :key="index" @click="emit('btnClick', item.prop, row)">
              <svg-icon
                :name="getIcon(item.prop, item.iconName)"
                :icon-style="{ width: '14px', height: '14px' }"
                class="mr-10"
              ></svg-icon>
              {{ item.content }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>
<script setup lang="ts" name="TableOperation">
import { computed, reactive } from 'vue';
type BtnType = 'edit' | 'delete' | 'add' | 'detail';

interface OperationItem {
  prop: BtnType;
  content?: string;
  iconName?: string;
  isDisabled?: (row: object) => boolean;
  isShow?: (row: object) => boolean;
}

interface OperationList {
  btnList: OperationItem[];
  row: any;
}

const props = defineProps<OperationList>();
const emit = defineEmits(['btnClick']);

const filterBtnList = computed(() => {
  //过滤隐藏的
  return props.btnList.filter(item => {
    return item.isShow(props.row);
  });
});
const moreBtnList = computed(() => {
  return filterBtnList.value.slice(3);
});

const TypeMap = reactive({
  delete: 'danger',
  edit: 'primary',
  add: 'primary',
  detail: 'primary'
});

const isBtnType = (value: BtnType | string): value is BtnType => {
  return ['edit', 'delete', 'add', 'detail'].includes(value);
};
const getIcon = (prop: BtnType | string, iconName?: string): string => {
  if (isBtnType(prop)) return prop;
  return iconName!;
};
</script>
<style scoped lang="scss">
:deep(.el-button--primary.is-plain) {
  border-color: var(--el-border-color) !important;
  color: var(--el-text-color-primary) !important;
  &:hover {
    color: white !important;
  }
  &.is-disabled {
    color: #6f6fa866 !important;
    &:hover {
      background-color: #fff !important;
      color: #6f6fa866 !important;
    }
    &:active {
      opacity: 1;
    }
  }
}
:deep(.el-button--danger.is-plain) {
  border-color: var(--el-border-color) !important;
  color: var(--el-text-color-primary) !important;
  &:hover {
    color: white !important;
  }
  &.is-disabled {
    color: #6f6fa866 !important;
    &:hover {
      background-color: #fff !important;
      color: #6f6fa866 !important;
    }
    &:active {
      opacity: 1;
    }
  }
}
</style>
