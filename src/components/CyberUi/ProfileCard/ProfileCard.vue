<template>
  <div style="position: relative; padding-top: 15px">
    <div class="content">
      <span class="title">{{ title }}</span>

      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts" name="">
defineOptions({
  name: 'ProfileCard'
});

const { title } = defineProps<{
  title: string;
}>();
</script>
<style scoped lang="scss">
.title {
  font-family: Microsoft YaHei;
  letter-spacing: 0px;
  box-shadow: 0px 15px 20px 0px rgba(52, 56, 106, 0.1);
  border: solid 1px #e6ebff;
  background-color: #fff;
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  top: -15px;
  padding: 0 15px;
  border-radius: 2px;
  font-size: 14px;
  text-align: center;
  line-height: 30px;
  color: rgb(111, 111, 168);
  height: 30px;
  z-index: 999;
}
.content {
  position: relative;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0px 15px 20px 0px rgba(52, 56, 106, 0.1);
  border-radius: 4px;
  border: solid 1px #e6ebff;
}
</style>
