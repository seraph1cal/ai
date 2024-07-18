<template>
  <div class="tooltipBox">
    <!--
      :popper-class="`tool-tip ${place == 'right' ? 'wyToop' : ''}`"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
     -->
    <el-tooltip :placement="place" v-if="strVal" :content="strVal.toString()" :disabled="isShow" effect="dark" v-bind="$attrs">
      <div @mouseover.stop="onMouseOver" class="col_over">
        <span ref="str">{{ strVal }}</span>
        <!--  :class="canClick ? 'cur' : ''" -->
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup name="Tooltip">
import { defineProps, ref } from 'vue';
defineProps({
  strVal: {
    type: String || Number
  },
  place: {
    type: null,
    default: 'top'
  }
});
interface strType {
  parentNode: {
    offsetWidth: number;
  };
  offsetWidth?: number;
}
let isShow = ref(false);
let str = ref<strType | null>(null);
function onMouseOver() {
  const tag = str.value;
  if (tag) {
    const parentWidth = tag.parentNode.offsetWidth;
    const contentWidth = tag.offsetWidth;
    if (contentWidth) isShow.value = contentWidth <= parentWidth;
  }
}
</script>
<style scoped>
.col_over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tool-tip {
  max-width: 600px;
}
.tooltipBox {
  width: 100%;
}
</style>
