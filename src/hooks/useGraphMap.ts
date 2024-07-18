import { GraphMap } from './interface';
import {
  defaultNode,
  defaultEdge,
  defaultLayout,
  defaultModes,
  setProcessParallelEdges
} from '@/utils/graphSettings/defaultSettings';
import G6 from '@antv/g6';
import event from '@/utils/graphSettings/event';

/**
 * @description 生成架构导图实例
 * @param {GraphMap.MapData} mapData 架构导图数据
 * @param {String} architectureMapId 架构导图id
 * @param {Number} userWidth 用户自定义宽度
 * @param {Number} userHeight 用户自定义高度
 * */
export const useArchitectureMapInstance = (
  mapData: GraphMap.MapData,
  architectureMapId: string,
  userWidth: number,
  userHeight: number
) => {
  const container = document.getElementById(architectureMapId);
  if (container) {
    const width = userWidth || container.scrollWidth;
    const height = userHeight || (container.scrollHeight > 500 ? container.scrollHeight : 500);
    const graph = new G6.TreeGraph({
      container: architectureMapId,
      width,
      height,
      modes: {
        default: ['collapse-expand', 'drag-canvas', 'zoom-canvas']
      },
      defaultNode: { type: 'crect' },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          stroke: '#A3B1BF'
        }
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId(d: any): string {
          return d.name;
        },
        getHeight(): number {
          return 16;
        },
        getVGap(): number {
          return 10;
        },
        getHGap(): number {
          return 100;
        },
        getWidth(d: any): number {
          return G6.Util.getTextSize(d.name, 16)[0] + 20;
        }
      },
      fitView: true
    });

    graph.data(mapData);
    graph.render();

    if (typeof window !== 'undefined') {
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
    }
  }
};

/**
 * @description 生成图谱实例
 * @param {Any} graphOption 图数据
 * @param {String} graphInfoModuleId 图谱id
 * @param {Number} canvasWidth 画布宽度
 * @param {Number} canvasHeight 画布高度
 * */
export const useGraphMapInstance = (graphOption: any, graphInfoModuleId: string, canvasWidth: number, canvasHeight: number) => {
  // 节点边数据
  const nodes = graphOption.nodes;
  const edges = graphOption.edges;
  const grid = new G6.Grid();
  let graphInstance = new G6.Graph({
    container: graphInfoModuleId,
    width: canvasWidth,
    height: canvasHeight,
    defaultNode,
    defaultEdge,
    fitView: true,
    fitCenter: true,
    layout: defaultLayout,
    plugins: [grid],
    nodeStateStyles: {
      selected: {
        stroke: '#f00000',
        lineWidth: 3
      },
      click: {
        stroke: '#f00000',
        lineWidth: 3
      }
    },
    edgeStateStyles: {
      click: {
        stroke: '#f00000',
        fill: '#f00000',
        lineWidth: 3
      },
      selected: {
        stroke: '#f00000',
        lineWidth: 3,
        fill: '#f00000'
      }
    },
    // 内置交互
    modes: {
      default: defaultModes,
      dragLasso: [
        {
          type: 'lasso-select',
          delegateStyle: {
            fill: '#f00',
            fillOpacity: 0.05,
            stroke: '#f0',
            lineWidth: 1
          },
          trigger: 'drag'
        }
      ]
    }
  });
  if (nodes.length > 0) {
    nodes.forEach((node: any): void => {
      node.label = node.id;
    });
  }
  edges.forEach((edge: any): void => {
    edge.label = edge.edgeType;
  });
  setProcessParallelEdges(edges);
  graphInstance.data(graphOption);
  graphInstance.render();
  // 实例事件;
  event(graphInstance);
};
