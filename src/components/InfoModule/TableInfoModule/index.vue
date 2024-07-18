<template>
  <div class="table-info-module">
    <div class="table-info-module-title">
      <span class="title-icon"></span>
      <span class="title-name">{{ title }}</span>
    </div>
    <el-table class="table-info-module-table" :data="tableData">
      <el-table-column
        show-overflow-tooltip
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
      />
    </el-table>
    <div class="clearfix">
      <el-pagination
        small
        :background="true"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="prev, pager, next"
        @current-change="changeCurrent"
        style="float: right; margin: 10px"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="TableInfoModule">
interface Props {
  title: string;
  columns: any;
  tableData: any;
  pagination: any;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:pagination']);

const changeCurrent = (currentPage: number): void => {
  const obj = {
    currentPage,
    pageSize: props.pagination.pageSize,
    total: props.pagination.total
  };
  console.log('changeCurrent===pagination', obj);
  emits('update:pagination', obj);
};
</script>

<style scoped lang="scss">
@import 'index';
</style>
