<template>
  <!-- 表格主体 -->
  <div :class="{ 'padding-card': searchColumns?.length }" :style="{ height: height ? height + 'px' : '100%' }">
    <div class="table-main card">
      <div class="table-header">
        <div class="header-button-lf">
          <slot name="tableHeader" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />
        </div>
        <div v-if="toolButton" class="header-button-ri">
          <!-- <slot name="toolButton">
            <el-button v-if="showToolButton('refresh')" :icon="Refresh" circle @click="getTableList" />
            <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" circle @click="openColSetting" />
            <el-button
              v-if="showToolButton('search') && searchColumns?.length"
              :icon="Search"
              circle
              @click="isShowSearch = !isShowSearch"
            />
          </slot> -->
        </div>
      </div>
      <!-- 表格主体 -->
      <el-table
        stripe
        ref="tableRef"
        v-bind="$attrs"
        size="small"
        :style="{ height: tableHeight }"
        :data="props.data"
        :border="border"
        :row-key="rowKey"
        @selection-change="selectionChange"
      >
        <!-- 默认插槽 -->
        <slot />
        <template v-for="(item, index) in tableColumns" :key="item">
          <!-- selection || radio || index || expand || sort -->
          <el-table-column
            v-if="item.type && columnTypes.includes(item.type)"
            v-bind="item"
            :align="tableAlign(item, index, tableColumns)"
          >
            <template #default="scope">
              <template v-if="item.type == 'index'">
                <span
                  class="text-primaryColor inline-block p-3 border-1 border-solid border-borderColor rounded-lg line-height-14"
                >
                  {{ renderIndex(scope.$index + 1) }}
                </span>
              </template>

              <!-- expand -->
              <template v-if="item.type == 'expand'">
                <component :is="item.render" v-bind="scope" v-if="item.render" />
                <slot v-else :name="item.type" v-bind="scope" />
              </template>
              <!-- radio -->
              <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey]">
                <i></i>
              </el-radio>
              <!-- sort -->
              <el-tag v-if="item.type == 'sort'" class="move">
                <el-icon> <DCaret /></el-icon>
              </el-tag>

              <span v-if="item.type == 'time'">
                {{
                  scope.row[scope.column.property] ? dayjs(scope.row[scope.column.property]).format('YYYY-MM-DD HH:mm:ss') : '--'
                }}
              </span>

              <template v-if="item.type === 'operation' && btnList?.length">
                <table-operation
                  :btn-list="afterBtnList"
                  :row="scope.row"
                  @btn-click="(prop, row) => emit('btnClick', prop, row)"
                ></table-operation>
              </template>
            </template>
          </el-table-column>
          <!-- other -->
          <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </TableColumn>
        </template>
        <!-- 插入表格最后一行之后的插槽 -->
        <template #append>
          <slot name="append" />
        </template>
        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/images/noData.png" alt="noData" style="width: 40%; height: 40%" />
            </slot>
          </div>
        </template>
      </el-table>
      <!-- 分页组件 -->
      <slot name="pagination" v-if="pagination">
        <cy-pagination v-bind="pageInfo" v-model:current-page="currentPage" v-model:page-size="pageSize"></cy-pagination>
      </slot>
    </div>
  </div>

  <!-- 列设置 -->
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script setup lang="ts" name="CyTable">
import { ref, provide, unref, computed, reactive, useAttrs, useSlots } from 'vue';
import { ElTable } from 'element-plus';
import { useSelection } from '@/hooks/useSelection';
import { ColumnProps, TypeProps } from '@/components/ProTable/interface';
import ColSetting from './components/ColSetting.vue';
import TableColumn from './components/TableColumn.vue';
import dayjs from 'dayjs';
import TableOperation from './components/TableOperation.vue';

/* index */
const renderIndex = index => {
  if (index <= 9) return '0' + index;
  return index;
};

defineOptions({
  name: 'CyTable'
});

const slots = useSlots();

// 定义 emit 事件
const emit = defineEmits<{
  btnClick: [{ prop: string; row: any }];
  search: [];
  reset: [];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
}>();

interface InitPageType {
  pageSize: number;
  currentPage: number;
}

export interface PageInfo {
  pageParams?: InitPageType;
  total: number;
  pageSizes?: number[];
  layout?: string;
  api?: (a: InitPageType, ...b: any[]) => void;
}

export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  title?: string; // 表格标题 ==> 非必传
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为false）
  toolButton?: ('refresh' | 'setting' | 'search')[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为false）
  rowKey?: any; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  btnList?: any[]; // 操作按钮数组,当type为operation并且有btnList的时候使用内置渲染,否则使用slot渲染
  height?: number; //表格外框高度

  //分页用
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  pageInfo?: PageInfo;
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  pagination: true,
  border: false,
  toolButton: false,
  rowKey: 'id',
  btnList: [] as any
});

const currentPage = defineModel<number>('currentPage');
const pageSize = defineModel<number>('pageSize');
// table 实例
const tableRef = ref<InstanceType<typeof ElTable>>();

//table的首列左对齐,尾列右对齐
const tableAlign = (item: any, index: number, arr: any[]) => {
  if (item.type == 'selection' || item.type == 'index') return 'center';
  if (index === 0) return 'left';
  if (index === arr.length - 1) return 'right';
  return item.align ?? 'center';
};

// column 列类型
const columnTypes: TypeProps[] = ['selection', 'radio', 'index', 'time', 'expand', 'sort', 'operation'];

const afterBtnList = computed(() => {
  return props.btnList.map(item => {
    const isShow = item.isShow ? item.isShow : () => true;
    return { ...item, isShow };
  });
});
// 是否显示搜索模块
// const isShowSearch = ref(true);

// 控制 ToolButton 显示
// const showToolButton = (key: 'refresh' | 'setting' | 'search') => {
//   return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
// };

/* 表格高度:
   有分页的时候, height = (传入高度/100%)-44px
   没有分页的时候, height = (传入高度/100%)

  紧凑型: 边框和table高度紧凑
  占满型: 边框占满, table高度自定义
*/

const attrs = useAttrs();
const { tableHeader } = slots;

const tableHeight = computed(() => {
  const baseHeight = attrs?.style?.height || '100%';

  let height = baseHeight;
  if (props.pagination) {
    height = `calc(${baseHeight} - 44px)`;
  }
  if (tableHeader) {
    height = `calc(${baseHeight} - 47px)`;
  }

  if (tableHeader && props.pagination) {
    height = `calc(${baseHeight} - 47px - 44px)`;
  }

  return height;
});

// 单选值
const radio = ref('');

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns);

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === 'function' || enumMap.value.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== 'function') return enumMap.value.set(prop!, unref(enumValue!));

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue();
  enumMap.value.set(prop!, data);
};

// 注入 enumMap
provide('enumMap', enumMap);

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns!.filter(item => {
  const { type, prop, isShow } = item;
  return !columnTypes.includes(type!) && prop !== 'operation' && isShow;
});

// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: props.data,
  radio,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds
});
</script>
