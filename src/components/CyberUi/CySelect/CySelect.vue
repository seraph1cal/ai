<template>
  <el-select v-bind="$attrs">
    <template #prefix v-if="props.label">
      <span class="text-textColor">{{ props.label }}</span>
      <div class="h-20 w-1 bg-borderColor"></div>
    </template>
    <template v-for="item in Object.keys($slots)" #[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
defineOptions({ name: 'CySelect' });

const props = defineProps<{ label: string }>();
</script>

<style lang="scss"></style>
