import G6 from '@antv/g6';
export const defaultNode = {
  type: 'iconFont',
  size: 20,
  style: {
    stroke: '#57B0f0',
    fillOpacity: 0.6
  },
  labelCfg: {
    position: 'bottom',
    style: {
      fill: '#333',
      fontSize: 12
    },
    visible: true
  },
  iconCfg: {
    visible: false,
    key: '',
    name: '',
    text: '',
    fill: '#696969'
  }
};

export const defaultEdge = {
  style: {
    stroke: '#57B0f0',
    lineWidth: 1,
    endArrow: {
      path: G6.Arrow.triangle(8, 8, 0),
      fill: '#57B0f0'
    }
  },
  labelCfg: {
    autoRotate: true,
    refX: 0,
    refY: 8,
    style: {
      fontSize: 12,
      fill: '	#696969'
    }
  },
  loopCfg: {
    position: 'top'
  }
};

export const defaultLayout = {
  type: 'gForce',
  linkDistance: 100,
  nodeStrength: 1000,
  edgeStrength: 500,
  preventOverlap: true,
  nodeSpacing: 20,
  damping: 0.9,
  coulombDisScale: 0.002,
  gravity: 10,
  workerEnabled: false,
  gpuEnabled: false
};

export const defaultModes = ['lasso-select', 'drag-canvas', 'zoom-canvas', 'drag-node', 'activate-relations'];

export const setProcessParallelEdges = (edges: any): void => {
  const offsetDiff = 30;
  const multiEdgeType = 'quadratic';
  const singleEdgeType = 'line';
  const loopEdgeType = 'loop';
  G6.Util.processParallelEdges(edges, offsetDiff, multiEdgeType, singleEdgeType, loopEdgeType);
};
