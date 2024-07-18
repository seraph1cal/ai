<template>
  <main class="main-content p-20 lg:p-40">
    <section class="flex flex-col justify-center">
      <h1 class="text-center lg:text-48 fw-900 text-26">Remove background of photo for <span class="text-#4a4aeb">free</span></h1>
      <p class="mt-2 px-8 text-center text-[#6E6F75] text-16 fw-700 lg:px-0">
        and replace it with different backgrounds of your choosing.
      </p>
      <div class="h-88 mt-32 mb-10 py-10 px-150 hidden lg:block">
        <img :src="Line" class="w-70%" />
      </div>
      <div class="images mt-20 lg:mt-0 w-full">
        <img :src="Or" alt="Image 1" class="image hidden lg:block" />
        <el-upload
          :before-upload="handleBeforeUpload"
          action="http://34.46.51.161/api/remove"
          :show-file-list="false"
          :limit="1"
          class="w-full"
        >
          <div
            class="mx-4 flex h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-10 border-#4a4af4 border border-dashed bg-white px-12 lg:mx-0 lg:h-[360px] lg:w-[560px] lg:px-0"
          >
            <el-button
              class="flex h-[60px] w-full max-w-[240px] items-center justify-center gap-2 rounded-8 text-white outline-none transition text-18 lg:h-[100px] lg:text-30 lg:w-[400px] lg:max-w-none lg:gap-4 lg:rounded-3xl"
              type="primary"
              >Upload Photo
            </el-button>
            <div class="formats">
              <span class="inline-block text-#777 border-#777 border-1 border-solid rounded-6 px-8 py-4 text-12 mr-5 lg:text-16">
                JPG
              </span>
              <span class="inline-block text-#777 border-#777 border-1 border-solid rounded-6 px-8 py-4 text-12 lg:text-16 mr-5">
                JPEG
              </span>
              <span class="inline-block text-#777 border-#777 border-1 border-solid rounded-6 px-8 py-4 text-12 lg:text-16 mr-5">
                PNG
              </span>
              <span class="inline-block text-#777 border-#777 border-1 border-solid rounded-6 px-8 py-4 lg:text-16 text-12">
                WEBP
              </span>
            </div>
            <p class="mt-4 fw-600 whitespace-pre-wrap text-center text-14 text-[#777]">Drag a file，paste image or URL</p>
          </div>
        </el-upload>
        <img :src="Re" alt="Image 2" class="image remove hidden lg:block" />
      </div>
    </section>
    <section class="photo-selection">
      <p class="mt-[20px] text-[#1A1A1A] fw-800">No photo? Pick one for you</p>
      <div class="photo-options">
        <img
          :src="item"
          alt="Option 1"
          class="option w-60 h-60 lg:w-90 lg:h-90"
          v-for="(item, index) in imgArr"
          :key="index"
          @click="handlePicClick(index)"
        />
      </div>
    </section>
    <Mask v-show="isMask" @close-mask="isMask = false" type="home"></Mask>
  </main>
</template>

<script setup lang="ts">
import Line from '@/assets/icons/line.svg';
import Or from '@/assets/images/home/Or.webp';
import Re from '@/assets/images/home/Re.webp';
import one from '@/assets/images/home/1.png';
import two from '@/assets/images/home/2.jpg';
import three from '@/assets/images/home/3.jpg';
import four from '@/assets/images/home/4.jpg';
import Mask from '@/components/Mask/index.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { useTabsStore } from '@/stores/modules/tabs';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { initDynamicRouter } from '@/routers/modules/dynamicRouter';
import useFile, { Action } from '@/hooks/useFile';

const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

const router = useRouter();

const { handleAction } = useFile();
const jump = () => {
  router.push({ path: '/detail', query: { from: 1 } });
};
const handleBeforeUpload = file => {
  handleAction(file, Action['UPLOAD'], jump);
  return false;
};

const imgArr = [one, two, three, four];

const isMask = ref(false);
onMounted(async () => {
  userStore.setToken('xxx');

  // 2.添加动态路由
  await initDynamicRouter();

  // 3.清空 tabs、keepAlive 数据
  tabsStore.setTabs([]);
  keepAliveStore.setKeepAliveName([]);

  document.addEventListener('dragenter', handleDragEnter);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('dragleave', hanleDragLeave);
});

onBeforeUnmount(() => {
  document.removeEventListener('dragenter', handleDragEnter);
  document.removeEventListener('dragover', handleDragOver);
  document.removeEventListener('dragleave', hanleDragLeave);
});

const handleDragEnter = e => {
  e.preventDefault();
  e.stopPropagation();
  isMask.value = true;
};
const handleDragOver = e => {
  e.preventDefault();
  e.stopPropagation();
};
const hanleDragLeave = e => {
  console.log(e.target.classList);

  e.preventDefault();
  if (e.target.classList.contains('mask')) {
    isMask.value = false;
  }
};

const handlePicClick = index => {
  //跳转
  router.push({ path: '/detail', query: { index } });
};
</script>

<style scoped lang="scss">
.feedback-button {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}
.main-content {
  text-align: center;
  box-sizing: border-box;
}

.images {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 300px;
  height: auto;
  margin: 0 20px;
}

.remove {
  --board-black-color: #4a4aeb33;
  --board-white-color: transparent;
  background-image: linear-gradient(45deg, var(--board-black-color) 25%, var(--board-white-color) 25%),
    linear-gradient(-45deg, var(--board-black-color) 25%, var(--board-white-color) 25%),
    linear-gradient(45deg, var(--board-white-color) 75%, var(--board-black-color) 75%),
    linear-gradient(-45deg, var(--board-white-color) 75%, var(--board-black-color) 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0;
}

.download-button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.formats {
  margin: 20px 0;
}

.photo-selection {
  margin-top: 40px;
}

.photo-options {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.option {
  cursor: pointer;

  border-radius: 50%;
  margin: 0 10px;
}
:deep(.el-upload) {
  width: 100%;
}
</style>
