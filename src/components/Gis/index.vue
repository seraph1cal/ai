<template>
  <div class="gis_container">
    <div class="gis_tool_content">
      <compositeSearch
        @toggle-draw="toggleDraw"
        @mark-point="setPointMarker"
        @mark-path="setPath"
        @clean-layers="cleanAllLayers"
        @synch-node-data="synchNodeData"
        ref="compositeSearchRef"
      />
    </div>
    <div class="gis_content" ref="gisRef" :id="props.initMapProp.mapContainerDomId">
      <div class="mouse-position" id="mouse-position"></div>
      <div class="zoom-position" id="zoom-position"></div>
      <div class="full-screen-position" id="full-screen-position"></div>
    </div>
    <div id="popup" class="ol-popup" v-show="popupVisiable">
      <div id="popup-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Gis">
import { ref, onMounted, defineProps, nextTick } from 'vue';
import { markPointProps, markLineProps, initMapProps } from './interface';
import Map from 'ol/Map.js';
// import OSM from 'ol/source/OSM.js';
import Draw from 'ol/interaction/Draw.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import * as olProj from 'ol/proj';
import View from 'ol/View.js';
import { Coordinate, createStringXY } from 'ol/coordinate';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { defaults as defaultControls, MousePosition } from 'ol/control.js';
import { Point, LineString, MultiLineString } from 'ol/geom';
import { Style, Stroke, Icon, RegularShape, Fill } from 'ol/style';
import { queryGeographyApi } from '@/api/modules/gis';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import compositeSearch from './components/compositeSearch.vue';
import point from './assets/images/point2.svg';
import pointSelected from './assets/images/point2_selected.svg';

interface Props {
  // 初始化地图参数
  initMapProp: initMapProps;
  // 标记点数据
  markPoints?: markPointProps[];
  // 标记连线数据
  markLines?: markLineProps[];
  // 瓦片地图数据源
  mapTileSource?: XYZ;
}
const props = withDefaults(defineProps<Props>(), {
  mapTileSource: () =>
    new XYZ({
      url: 'http://172.16.50.120:8886/data/gg_1_12/{z}/{x}/{y}.png'
    })
});

const popupVisiable = ref(false);
const spaceId = 6;
const drawPolygon = ref(null);
const gisRef = ref<HTMLElement | null>(null);
let map = ref<Map | null>(null);
let overlay = ref<Overlay | null>(null);
const currentSearchVid = ref({});
const mapSourceLayer = ref<TileLayer | null>(
  new TileLayer({
    source: props.mapTileSource
  })
);
let drawPolygonData = ref([]);
const compositeSearchRef = ref();
const emit = defineEmits(['toggleDraw', 'pointDetail', 'clickPointDetail']);

onMounted(() => {
  initMap();
  bindEvent();
  // props.markPoints?.length && setPointMarker(props.markPoints);
  props.markLines?.length && setPath(props.markLines);
});

// 初始化地图
function initMap() {
  // 地图实例
  map.value = new Map({
    target: props.initMapProp.mapContainerDomId,
    layers: [mapSourceLayer.value],
    view: new View({
      // projection: 'EPSG:4326', // 坐标系，有EPSG:4326 [经度, 纬度]和EPSG:3857 []
      projection: 'EPSG:3857',
      center: olProj.fromLonLat([-97.83, 38.9033]),
      // center: olProj.fromLonLat(props.initMapProp.mapCenter),
      zoom: 4,
      minZoom: 0,
      maxZoom: 13
    }),
    controls: defaultControls({
      attribution: true,
      rotate: false,
      zoom: true,
      zoomOptions: {
        className: 'zoom-position-container',
        target: document.getElementById('zoom-position')
      }
    }).extend([
      new MousePosition({
        className: 'mouse-position',
        coordinateFormat: createStringXY(4),
        target: document.getElementById('mouse-position'),
        projection: 'EPSG:4326'
      })
    ])
  });
}

const showPopup = () => {
  popupVisiable.value = true;
  nextTick(() => {
    const popup_container = document.getElementById('popup');
    // 弹出框
    overlay.value = new Overlay({
      element: popup_container,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });
    // 关闭按钮
    // popup_closer.onclick = function () {
    //   overlay.value?.setPosition(undefined);
    //   popup_closer.blur();
    //   return false;
    // };
    // 添加弹出框
    map.value.addOverlay(overlay.value);
  });
};
const synchNodeData = nodeData => {
  currentSearchVid.value = nodeData;
};
// 绑定事件
const bindEvent = () => {
  showPopup();
  const popup_content = document.getElementById('popup-content');
  map.value.on('click', (evt: { pixel: any }) => {
    const feature = map.value?.forEachFeatureAtPixel(evt.pixel, (feature: any) => feature);
    if (feature && feature.get('name') === 'Marker') {
      let coordinates = feature.getGeometry().getCoordinates();
      let extendData = feature.getProperties().extendData;
      let markType = feature.getProperties().markType;
      const pointData = {
        feature,
        coordinates,
        data: extendData,
        searchType: compositeSearchRef.value.searchType,
        markType
      };
      emit('clickPointDetail', pointData);
    } else {
      // markDetailVisible.value = false;
    }
  });
  // 鼠标移入手势
  map.value.on('pointermove', evt => {
    if (map.value?.hasFeatureAtPixel(evt.pixel)) {
      map.value.getViewport().style.cursor = 'pointer';
      const feature = map.value?.forEachFeatureAtPixel(evt.pixel, (feature: any) => feature);
      if (feature && feature.get('name') === 'Marker') {
        let coordinates = feature.getGeometry().getCoordinates();
        let extendData = feature.getProperties().extendData;
        let extendHtml = '';
        // for (const key in extendData) {
        //   if (Object.prototype.hasOwnProperty.call(extendData, key)) {
        //     const element = extendData[key];
        //     extendHtml += `<p>${key}: ${element}</p>`;
        //   }
        // }
        const content = `
          <p>地理位置信息:</p><code>${olProj.toLonLat(coordinates)}</code>
        `;
        // popup_content.innerHTML = content;
        // const pointData = {
        //   coordinates,
        //   data: extendData
        // };
        // emit('pointDetail', pointData);
        // overlay.value?.setPosition(coordinates);
      }
    } else {
      overlay.value?.setPosition(undefined);
      map.value.getViewport().style.cursor = 'inherit';
    }
  });
};
// 根据多边形坐标 查询位置节点
const setMarkerfromDraw = async () => {
  const array = drawPolygonData.value;
  const polygonList = [];
  for (let index = 0; index < array.length; index++) {
    let element = array[index];
    let coord = olProj.transform(element, 'EPSG:3857', 'EPSG:4326');
    polygonList.push(coord);
  }
  let polygon = '';
  polygonList.forEach(item => {
    polygon += `${item[0]} ${item[1]},`;
  });
  const param = {
    spaceId,
    tagName: 'location',
    propertyName: 'geo_point',
    polygon: polygon.slice(0, -1),
    nodeType: compositeSearchRef.value.searchType
  };
  const { data } = await queryGeographyApi(param);
  // 先清空画布
  cleanAllLayers();
  let nodes = data.nodes
    .filter((item: { data: { lon: any; lat: any } }) => item.data.lon && item.data.lat)
    .map((item: { data: { lat: any; lon: any }; id: any }) => {
      return {
        id: item.id,
        ...item.data,
        coordinate: [item.data.lon, item.data.lat]
      };
    });
  setPointMarker(nodes, 'location');
};
// 标记点
const setPointMarker = (coordinateData: any[], markType) => {
  cleanAllLayers();
  const centerCoordinate = coordinateData[0].coordinate;
  const features = coordinateData.map(item => {
    const feature = new Feature({
      geometry: new Point(olProj.transform(item.coordinate, 'EPSG:4326', 'EPSG:3857')),
      name: 'Marker',
      extendData: item,
      markType
    });
    feature.setStyle(createPointStyle(item));
    return feature;
  });
  const vectorSource = new VectorSource({
    features: features
  });
  // 创建矢量图层
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    properties: {
      name: 'point'
    }
  });
  // Vector图层添加到地图
  map.value?.addLayer(vectorLayer);
  const view = map.value?.getView();
  view?.setCenter(olProj.fromLonLat(centerCoordinate));
};

const createPointStyle = item => {
  return new Style({
    image: new Icon({
      anchor: [0.5, 0.9],
      width: 26,
      height: 26,
      src: item.id === currentSearchVid.value.id ? pointSelected : point
    }),
    zIndex: Infinity
  });
};

// 设置连线
const setPath = markLines => {
  // 路径-数据源
  const lineFeatures = markLines.map(item => {
    const feature = new Feature({
      geometry: new LineString([olProj.fromLonLat(item.lineCoordinates[0]), olProj.fromLonLat(item.lineCoordinates[1])]),
      extendData: item.data || ''
    });
    let style = styleFunction(feature);
    feature.setStyle(style);
    // let animation = animateLine(feature);
    return feature;
  });

  const layerSource = new VectorSource({
    features: lineFeatures
  });
  // 标记路线-层openlayer就是由一个一个的层形成的
  const layer = new VectorLayer({
    source: layerSource,
    properties: {
      name: 'path'
    }
  });
  map.value?.addLayer(layer);
};
// 设置线段样式
const styleFunction = (feature: any) => {
  // 线段样式
  const styles = [
    new Style({
      stroke: new Stroke({
        width: 2,
        color: '#2D8CF0'
      })
      // geometry: () => {
      //   let coordinates = feature.getGeometry().getCoordinates();
      //   return new MultiLineString([[coordinates[coordinates.length - 2], coordinates[coordinates.length - 1]]]);
      // },
      // image: new RegularShape({
      //   fill: new Fill({ color: 'red' }),
      //   stroke: new Stroke({ color: 'red', width: 2 }),
      //   points: 3, // 三角形
      //   radius: 10, // 箭头大小
      //   rotation: Math.PI / 2 // 旋转角度，使箭头指向线的方向
      // })
    })
  ];
  styles.push(
    new Style({
      geometry: () => {
        let coordinates = feature.getGeometry().getCoordinates();
        return new MultiLineString([[coordinates[coordinates.length - 2], coordinates[coordinates.length - 1]]]);
      },
      image: new RegularShape({
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({ color: 'red', width: 2 }),
        points: 3, // 三角形
        radius: 10, // 箭头大小
        rotation: Math.PI / 2 // 旋转角度，使箭头指向线的方向
      })
    })
  );
  // const geometry = feature.getGeometry();
  // geometry.forEachSegment(function (start: any, end: any) {
  //   let dx = end[0] - start[0];
  //   let dy = end[1] - start[1];
  //   let rotation = Math.atan2(dy, dx);
  //   styles.push(
  //     new Style({
  //       geometry: new Point(end),
  //       image: new Icon({
  //         src: '@/assets/image/path.png',
  //         anchor: [1, 0.5],
  //         rotateWithView: true,
  //         rotation: rotation
  //       })
  //     })
  //   );
  // styles.push(
  //   new Style({
  //     geometry: new Point(end),
  //     image: new RegularShape({
  //       fill: new Fill({ color: '#2D8CF0' }),
  //       stroke: new Stroke({ color: '#ffffff', width: 1 }),
  //       points: 3, // 箭头的点数
  //       angle: 0,
  //       radius: 8, // 箭头大小
  //       rotation: rotation - 1 // 旋转角度，使箭头朝向正确方向
  //     })
  //   })
  // );
  // });
  return styles;
};
// const animateLine = (feature: any) => {
//   let lineCoords = feature.getGeometry().getCoordinates();
//   let animationIndex = 0;
//   let length = lineCoords.length;
//   if (animationIndex < length - 1) {
//     let start = lineCoords[animationIndex];
//     let end = lineCoords[animationIndex + 1];
//     let animationGeometry = new LineString([start, end]);
//     let animationFeature = new Feature({
//       geometry: animationGeometry
//     });
//     animationFeature.setStyle(
//       new Style({
//         stroke: new Stroke({
//           color: 'red',
//           width: 5
//         })
//       })
//     );
//     VectorSource.addFeature(animationFeature);

//     // 使用动画库实现平滑移动效果
//     let duration = 1000; // 每个动画持续时间（毫秒）
//     let startAnimation = new Date().getTime();
//     let listenerKey = VectorLayer.on('postrender', (event: any) => {
//       let frameState = event.frameState;
//       let elapsedTime = frameState.time - startAnimation;
//       let fraction = elapsedTime / duration;
//       if (fraction < 1) {
//         let currentCoords = [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];
//         animationGeometry.setCoordinates([start, currentCoords]);
//       } else {
//         ol.Observable.unByKey(listenerKey); // 移除事件监听器
//         animationIndex++;
//         animateLine();
//       }
//       map.render();
//     });
//   }
// };
// 添加多边形选择矢量图层
const addInteraction = () => {
  let source = new VectorSource({ wrapX: false });
  let vector = new VectorLayer({
    source: source,
    properties: {
      name: 'polygon'
    }
  });
  map.value?.addLayer(vector);
  drawPolygon.value = new Draw({
    source: source,
    type: 'Polygon'
  });
  drawPolygon?.value.on('drawend', (evt: { feature: any }) => {
    drawPolygonData.value = [];
    // 多边形 会有多个坐标集合 只取第一个
    let polygon = evt.feature.getGeometry().getCoordinates();
    drawPolygonData.value = polygon[0];
    setMarkerfromDraw();
    toggleDraw();
  });
  map.value?.addInteraction(drawPolygon.value);
};
// 控制画多边形
const toggleDraw = () => {
  emit('toggleDraw');
  if (drawPolygon?.value) {
    map.value?.removeInteraction(drawPolygon.value);
    drawPolygon?.value.abortDrawing();
    drawPolygon.value = null;
    let allLayers = map.value?.getAllLayers();
    allLayers?.forEach(e => {
      if (e.getProperties().name === 'polygon') {
        map.value?.removeLayer(e);
      }
    });
  } else {
    addInteraction();
  }
};
// 清除所有图层
const cleanAllLayers = () => {
  let allLayers = map.value?.getAllLayers();
  allLayers?.forEach(e => {
    if (e.getProperties().name === 'polygon' || e.getProperties().name === 'point' || e.getProperties().name === 'path') {
      map.value?.removeLayer(e);
    }
  });
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
