<!-- 经典布局 -->
<template>
  <section class="flex flex-col h-full">
    <header class="h-80 shrink-0 flex w-full justify-between items-center sm:px-26 md:px-45">
      <svg-icon
        class="cursor-pointer"
        name="logo"
        :icon-style="{ width: '120px', height: '30px' }"
        @click="$router.push('/')"
      ></svg-icon>
      <el-button
        class="hidden lg:flex items-center justify-center rounded-[8px] border fw-800 border-black w-[100px] h-[40px] text-16px transition"
        >feedback
      </el-button>
    </header>
    <el-container class="flex-1 flex flex-col overflow-auto">
      <Main class="bg" />
      <footer class="100px">&nbsp;</footer>
    </el-container>
  </section>
</template>

<script setup lang="ts" name="layoutClassic">
import Main from '@/layouts/components/Main/index.vue';
</script>

<style scoped lang="scss">
@import './index.scss';

.logo {
  font-size: 24px;
  font-weight: bold;
}

.fixMenu {
  height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px 0 25px;
  background-color: #fafbff;
}
.collapse {
  justify-content: center;
  padding: 0;
}
</style>
