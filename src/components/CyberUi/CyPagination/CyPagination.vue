<template>
  <el-pagination
    :total="total"
    small
    background
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    layout="total,sizes,prev,pager,next,jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    v-bind="$attrs"
  ></el-pagination>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CyPagination'
});

interface PageInfo {
  currentPage: number;
  pageSize: number;
}

interface PageType {
  total: number;
  api: (pagination: PageInfo) => void;
}

const pageSize = defineModel<number>('pageSize', { required: true });
const currentPage = defineModel<number>('currentPage', { required: true });

const props = defineProps<PageType>();

const handleCurrentChange = (val: number) => {
  currentPage.value = val;

  props.api({ currentPage: val, pageSize: pageSize.value });
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
  props.api({ currentPage: 1, pageSize: val });
};
</script>
<style lang=""></style>
