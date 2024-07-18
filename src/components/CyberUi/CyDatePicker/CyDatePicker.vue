<template>
  <el-date-picker v-bind="$attrs" :prefix-icon="labelCmp as string" class="custom-date-picker">
    <template v-for="item in Object.keys($slots)" #[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
  </el-date-picker>
</template>

<script setup lang="tsx">
import { defineOptions } from 'vue';
defineOptions({ name: 'CyDatePicker' });

const props = defineProps<{ label: string }>();

const labelCmp = () => {
  return (
    <span
      style={{
        fontStyle: 'normal',
        color: '#6f6fa8',
        borderRight: '1px solid rgba(230, 235, 255, 1)',
        paddingRight: '5px',
        'whiteSpace': 'nowrap'
      }}
    >
      {props.label}
    </span>
  );
};
</script>

<style lang="scss">
.custom-date-picker {
  &.el-input--default {
    .el-input__prefix-inner {
      padding: 0 20px !important;
    }
  }
  &.el-input--small {
    .el-input__prefix-inner {
      padding: 0 20px !important;
    }
  }
  .el-range-input {
    color: var(--el-color-primary);
  }

  /* range */

  &.el-range-editor--small.el-input__wrapper {
    .el-range__icon {
      padding: 0 27px !important;
      font-size: 12px;
    }
  }
  &.el-range-editor.el-input__wrapper {
    .el-range__icon {
      padding: 0 29px !important;
    }
  }
}
</style>
