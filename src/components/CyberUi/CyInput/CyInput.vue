<template>
  <el-input
    v-bind="$attrs"
    @blur="handleBlur"
    @focus="handleFocus"
    ref="inputRef"
    :clearable="false"
    @keyup.enter="emit('search')"
  >
    <!-- 取消原生的清除,因为位置固定不了 -->
    <template #prefix>
      <span v-if="!props.icon" class="label">{{ props.label }}</span>
      <svg-icon v-else :name="props.icon" :icon-style="props.iconStyle"></svg-icon>
    </template>

    <template #suffix>
      <el-space>
        <slot name="suffix"></slot>

        <svg-icon
          name="close"
          @click="handleClear"
          :style="{ cursor: 'pointer', marginRight: props.isSearch ? '' : 10 }"
          class="delete-icon"
          v-if="props.isClear"
        >
        </svg-icon>

        <el-button type="primary" :plain="!isFocus" @click="emit('search')" v-if="props.isSearch">搜 索</el-button>
      </el-space>
    </template>
  </el-input>
</template>
<script setup lang="ts">
import { ref } from 'vue';
defineOptions({
  name: 'CyInput'
});

const props = defineProps<{
  label?: string; // 前缀为 label 时
  icon?: string; // 前缀为 icon
  iconStyle?: Object; // icon 的样式,可以调整大小
  isSearch?: boolean; //是否显示搜索按钮
  isClear?: boolean; //是否显示清除
}>();

const emit = defineEmits(['blur', 'focus', 'search', 'clear']);

const inputRef = ref(null);
const isFocus = ref(false);

const handleBlur = (...arg: any[]) => {
  isFocus.value = false;
  emit('blur', arg);
};

const handleFocus = (...arg: any[]) => {
  isFocus.value = true;
  emit('focus', arg);
};

const handleClear = () => {
  inputRef.value?.clear();
  emit('clear');
};

defineExpose({
  handleClear
});
</script>

<style scoped lang="scss">
.label {
  color: var(--el-text-color-primary);
}

:deep(.el-input__wrapper) {
  padding: 0 11px;
  padding-right: 1px;
}
:deep(.el-button--primary) {
  border-radius: 0 2px 2px 0;
  border: var(--el-border-color);
}
:deep(.el-input__inner) {
  padding: 0 11px;
  border-left: 1px solid var(--el-border-color);
}
:deep(.el-button--primary.is-plain) {
  background-color: #eff2ff !important;
  &:hover {
    background-color: var(--el-color-primary) !important;
  }
}

.delete-icon {
  transition: transform 0.3s;
  &:hover {
    transform: rotateZ(180deg);
  }
}
</style>
