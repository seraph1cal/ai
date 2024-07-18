<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <!-- <el-footer v-show="footer">
    <Footer />
  </el-footer> -->
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, provide, watch, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/core';
import { useGlobalStore } from '@/stores/modules/global';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import Footer from '@/layouts/components/Footer/index.vue';
import { useEmbedStore } from '@/stores/modules/embed';
import { useRouter, useRoute } from 'vue-router';
import { HOME_URL } from '@/settings';

const router = useRouter();
const route = useRoute();
const { isEmbed } = useEmbedStore();
const globalStore = useGlobalStore();
const { maximize, isCollapse, layout, tabs, footer } = storeToRefs(globalStore);

const keepAliveStore = useKeepAliveStore();
const { keepAliveName } = storeToRefs(keepAliveStore);
const back = () => {
  if (backDisable.value) return;

  if (window.history.state) {
    if (window.history.state.position > 1) {
      router.go(-1);
    } else {
      router.push('/');
    }
  } else {
    router.push('/');
  }
};

const forward = () => {
  if (forwardDisable.value) return;
  router.go(1);
};
const backDisable = ref(false);
const forwardDisable = ref(false);

watch(
  route,
  val => {
    if (window.history.state.current == HOME_URL) backDisable.value = true;
    else backDisable.value = false;
    if (window.history.state.forward === null) forwardDisable.value = true;
    else forwardDisable.value = false;
  },
  { immediate: true }
);
// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide('refresh', refreshCurrentPage);

// 监听当前页面是否最大化，动态添加 class
watch(
  () => maximize.value,
  () => {
    const app = document.getElementById('app') as HTMLElement;
    if (maximize.value) app.classList.add('main-maximize');
    else app.classList.remove('main-maximize');
  },
  { immediate: true }
);

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => layout.value,
  () => {
    const body = document.body as HTMLElement;
    body.setAttribute('class', layout.value);
  },
  { immediate: true }
);

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0);
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!isCollapse.value && screenWidth.value < 1200) globalStore.setGlobalState('isCollapse', true);
  if (isCollapse.value && screenWidth.value > 1200) globalStore.setGlobalState('isCollapse', false);
}, 100);
window.addEventListener('resize', listeningWindow, false);
onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow);
});
</script>

<style scoped lang="scss">
@import './index.scss';

.tool-bar-lf {
  background-color: #fdfdfe;
  display: flex;
  position: relative;
  z-index: 98;
  box-shadow: 0 10px 20px rgba(45, 62, 150, 0.05);
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid rgba(233, 234, 255, 1);
  height: 40px;
  padding: 0 20px;
  flex-shrink: 0;
}
</style>
