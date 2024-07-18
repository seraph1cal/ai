import { createApp } from 'vue';
import App from './App.vue';
// reset style sheet
import '@/styles/reset.scss';
// CSS common style sheet
import '@/styles/common.scss';
// iconfont css
import '@/assets/fonts/iconfont/iconfont.scss';
// font css
import '@/assets/fonts/font.scss';
// element css
import 'element-plus/dist/index.css';
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css';
// custom element dark css
import '@/styles/element-dark.scss';
// custom element css
import '@/styles/element.scss';
//全局常用样式表
import '@/styles/auxiliaryCss.scss';

// svg icons
import 'virtual:svg-icons-register';
// element plus
import ElementPlus from 'element-plus';
// element icons
import * as Icons from '@element-plus/icons-vue';
// custom directives
import directives from '@/directives/index';
// vue Router
import router from '@/routers';
// vue i18n
import I18n from '@/languages/index';
// pinia store
import pinia from '@/stores';
// errorHandler
import errorHandler from '@/utils/errorHandler';
import warnHandler from '@/utils/warnHandler';
import CyberUi from 'cyberplus';
import 'cyberplus/style.css';
import PublicCompnents from '@/components';
import 'uno.css';
const app = createApp(App);

app.config.errorHandler = errorHandler;

app.config.warnHandler = warnHandler;
// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(ElementPlus).use(PublicCompnents).use(CyberUi).use(directives).use(router).use(I18n).use(pinia).mount('#app');
// app.use(ElementPlus).use(PublicCompnents).use(directives).use(router).use(I18n).use(pinia).mount('#app');
