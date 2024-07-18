import { defineConfig, presetUno, presetAttributify } from 'unocss';
import { presetRemToPx } from '@unocss/preset-rem-to-px';
export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetRemToPx({ baseFontSize: 4 })],
  rules: [],
  shortcuts: [['f-cc', 'flex justify-center items-center']],
  theme: {
    colors: {
      primaryColor: 'var(--el-color-primary)',
      bgColor: 'var(--el-bg-color)',
      borderColor: 'var(--el-border-color)',
      textColor: 'var(--el-text-color-primary)'
    },
    breakpoints: {
      sm: '320px',
      md: '640px',
      lg: '768px'
    }
  }
});
