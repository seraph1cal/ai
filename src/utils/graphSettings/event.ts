export default (graph: any): void => {
  // 点击画布
  graph.on('canvas:click', () => {
    graph.getNodes().forEach((node: any): void => {
      graph.clearItemStates(node);
      graph.setItemState(node, 'click', false);
      // 节点置灰效果
      if (node.hasState('grayPlacement')) {
        node.clearStates('grayPlacement');
      }
    });
    graph.getEdges().forEach((edge: any): void => {
      // 节点置灰效果
      if (edge.hasState('click')) {
        edge.clearStates('click');
      }
    });
  });

  // 监听鼠标点击节点
  graph.on('node:click', (e: any): void => {
    const nodeItem = e.item;
    // 设置目标节点的 click 状态 为 true
    const Click = nodeItem.hasState('click');
    graph.setItemState(nodeItem, 'click', !Click);
  });

  // 监听鼠标点击边
  graph.on('edge:click', (e: any): void => {
    // 先将所有当前有 click 状态的边的 click 状态置为 false
    const clickEdges = graph.findAllByState('edge', 'click');
    clickEdges.forEach((ce: any): void => {
      graph.setItemState(ce, 'click', false);
    });
    const edgeItem = e.item;
    // 设置目标边的 click 状态 为 true
    graph.setItemState(edgeItem, 'click', true);
  });
};
