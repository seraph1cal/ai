<template>
  <div class="search-content">
    <el-autocomplete
      v-model="searchVal"
      :fetch-suggestions="querySearch"
      clearable
      style="width: 500px"
      placeholder="请输入搜索条件"
      class="input-with-select"
      @select="handleSelect"
    >
      <template #prepend>
        <el-select v-model="searchType" placeholder="" size="default" style="width: 100px" @change="changeSearchType">
          <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" @click="fnSearch"></el-button>
      </template>
    </el-autocomplete>
    <el-button :icon="Crop" @click="toggleDraw" title="多边形选图" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive, watch } from 'vue';
import { Search, Crop } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { queryTagApi, queryVidValuesApi, queryNodeValuesApi, queryDrillDownApi, queryTagDetailApi } from '@/api/modules/gis';
import { useRoute } from 'vue-router';
const route = useRoute();
const emit = defineEmits(['toggleDraw', 'markPoint', 'markPath', 'cleanLayers', 'synchNodeData']);
let searchType = ref('institution');
let searchVal = ref('');
let vidList = ref([]);
const searchTypes = ref([]);
const graphData = reactive({
  nodes: [],
  edges: []
});

const spaceId = 6;
let getTypeId: {
  [key: string]: string;
} = {};

onMounted(() => {
  // console.log(22);
});

//查询类型标签列表
const queryTag = async () => {
  const params = {
    paramsBO: {
      filters: [
        {
          field: 'graph_space_id',
          operator: '=',
          value: spaceId
        }
      ]
    },
    type: 1
  };
  const { data } = await queryTagApi(params);
  searchTypes.value = [
    { label: '机构', value: 'institution' },
    { label: 'ip地址', value: 'ip' }
  ];
  // 所有标签的别名 / 描述
  let typeMap = {};
  data.data.forEach(item => {
    getTypeId[item.name] = item.id;
    typeMap[item.name] = item.description;
  });
  localStorage.setItem('typeMap', JSON.stringify(typeMap));
  // if (!searchType.value) searchType.value = 'institution';
  if (!localStorage.getItem(searchType.value)) {
    await queryTagDetail(getTypeId[searchType.value], searchType.value);
  }
};
queryTag();

//联想模糊查询
const searchPrompt = async () => {
  const params = {
    pageSize: 10,
    spaceId,
    tagName: searchType.value,
    value: searchVal.value
  };
  if (!searchType.value) return;
  const { data } = await queryVidValuesApi(params);
  vidList.value = data.map((item: any) => {
    return {
      value: item,
      link: item
    };
  });
};

//查询字段中英文对照关系
const queryTagDetail = async (id: string, type: string) => {
  const params = {
    id
  };
  const { data } = await queryTagDetailApi(params);
  let map: {
    [key: string]: string;
  } = {};
  data.properties.forEach(item => [(map[item.name] = item.description)]);
  localStorage.setItem(type, JSON.stringify(map));
};
// 控制选择
function toggleDraw() {
  emit('toggleDraw');
}

const querySearch = async (queryString: string, cb: Function) => {
  await searchPrompt();
  const results = queryString ? vidList.value : vidList.value;
  cb(results);
};
// 点击搜索查询机构/IP
const fnSearch = async () => {
  if (!searchVal.value) {
    ElMessage.warning('请输入查询内容');
    return;
  }
  graphData.edges = [];
  graphData.nodes = [];
  let params = {
    spaceId,
    tagName: searchType.value,
    value: searchVal.value,
    pageSize: 99,
    pageCount: 1
  };
  const { data } = await queryNodeValuesApi(params);
  if (data.nodes.length) {
    mergeGraphData(data);
    emit('synchNodeData', data.nodes[0]);
    fnGetSearchVidRelate(data.nodes[0].id);
  } else {
    ElMessage.warning('未查询到结果');
  }
};

const { type, name } = route.query;
if (type && name) {
  searchType.value = type;
  searchVal.value = name;
  fnSearch();
}
// 节点去重
const uniqueFunc = (array: string | any[], uniId: string | number) => {
  const obj = new Map();
  let arr = [];
  for (let i = array.length; i > 0; i--) {
    const item = array[i - 1];
    if (item) {
      if (uniId) {
        if (!obj.has(item[uniId])) {
          obj.set(item[uniId], 1);
          arr.push(item);
        }
      } else {
        if (!obj.has(item)) {
          obj.set(item, 1);
          arr.push(item);
        }
      }
    }
  }
  return arr;
};
// 边去重
const edgeUniqueFunc = (arr: any) => {
  const temp: any[] = [];
  const array = arr;
  array.forEach(function (a: { source: any; target: any; edgeType: any; uid: any }) {
    if (!a) return;
    let check = temp.some(b => a.source === b.source && a.target === b.target && a.edgeType === b.edgeType);
    if (!check) {
      temp.push(a);
    }
  });
  return temp;
};
// 合并节点数据
const mergeGraphData = graph => {
  graphData.edges = graph.edges.length !== 0 ? edgeUniqueFunc(graphData.edges.concat(graph.edges)) : graphData.edges;
  graphData.nodes = graph.nodes.length !== 0 ? uniqueFunc(graphData.nodes.concat(graph.nodes), 'id') : graphData.nodes;
  // console.log('graphData', graphData);
  let coordinateData = handleLocationData(graphData);
  if (coordinateData.length) {
    emit('markPoint', coordinateData, searchVal.value);
  }
  let lineData = setPathLines(graphData);
  if (lineData.length) {
    emit('markPath', lineData, searchVal.value);
  }
};
// 查询关联节点数据
const fnGetSearchVidRelate = async id => {
  const params = {
    spaceId,
    direction: 2,
    vid: id,
    tagName: searchType.value,
    isLocatedNode: true
  };
  const { data } = await queryDrillDownApi(params);
  mergeGraphData(data);
};
// 设置连线
const setPathLines = data => {
  let markLines = [];
  for (let index = 0; index < data.edges.length; index++) {
    const element = data.edges[index];
    const source = data.nodes.find(e => e.id === element.source);
    const target = data.nodes.find(e => e.id === element.target);
    if (
      source.locatedNode.nodes[0]?.data.lon &&
      source.locatedNode.nodes[0]?.data.lat &&
      target.locatedNode.nodes[0]?.data.lon &&
      target.locatedNode.nodes[0]?.data.lat
    ) {
      let sourceCoord = [source.locatedNode.nodes[0].data.lon, source.locatedNode.nodes[0].data.lat];
      let targetCoord = [target.locatedNode.nodes[0].data.lon, target.locatedNode.nodes[0].data.lat];
      markLines.push({
        lineCoordinates: [sourceCoord, targetCoord]
      });
    }
  }
  // console.log('markLines', markLines);
  return markLines;
};
// 处理所有带坐标的节点数据
const handleLocationData = data => {
  let locationData = [];
  if (data.nodes.length !== 0) {
    data.nodes.forEach(item => {
      // console.log('item', item);
      if (item.locatedNode) {
        item.locatedNode.nodes.forEach(e => {
          if (e.data.lon && e.data.lat) {
            locationData.push({
              id: item.id,
              showName: item.showName,
              data: {
                lat: e.data?.lat,
                lon: e.data?.lon
              },
              coordinate: [e.data?.lon, e.data?.lat]
            });
          }
        });
      }
    });
  }
  return locationData;
};
defineExpose({
  searchType,
  searchVal
});
function handleSelect() {
  fnSearch();
}
const changeSearchType = async () => {
  searchVal.value = '';
  graphData.nodes = [];
  graphData.edges = [];
  emit('cleanLayers');
  await searchPrompt();
  if (!localStorage.getItem(searchType.value)) {
    await queryTagDetail(getTypeId[searchType.value], searchType.value);
  }
};
</script>
<style lang="scss" scoped>
.search-content {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
