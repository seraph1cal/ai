<template>
  <el-upload drag multiple action="http://34.46.51.161/api/remove" :before-upload="handleBeforeUpload">
    <div class="mask text-50 fw-900 text-white flex items-center justify-center">
      <span>Drop your image anywhere</span>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import useFile, { Action } from '@/hooks/useFile';

const { handleAction } = useFile();

const props = defineProps<{
  type: string;
}>();

const router = useRouter();

const emit = defineEmits(['closeMask', 'done']);

const fn = () => {
  if (props.type == 'detail') {
    emit('done');
  } else router.push({ path: '/detail', query: { from: 1 } });
};

const handleBeforeUpload = file => {
  emit('closeMask');

  handleAction(file, Action['UPLOAD'], fn);
  return false;
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  z-index: 100;
  right: 0;
  left: 0;
  top: 0;
  background: #5454ebee;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
