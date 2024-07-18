import G6 from '@antv/g6';

// 注册架构节点
export const registerArchitectureMapNode = (): void => {
  G6.registerNode('crect', {
    draw(cfg: any, group: any) {
      const width = cfg.name.length * 10;
      const rect = group.addShape('rect', {
        attrs: {
          x: 0,
          y: -10,
          ...cfg.style,
          width,
          height: 20,
          lineWidth: 0,
          opacity: 0
        },
        name: 'rect-shape',
        draggable: true
      });
      const label = group.addShape('text', {
        attrs: {
          text: cfg.name,
          fill: '#666',
          fontSize: 16,
          x: 0,
          y: 0
        },
        name: 'label-shape',
        draggable: true
      });
      const labelBBox = label.getBBox();
      group.addShape('circle', {
        attrs: {
          x: labelBBox.maxX + 10,
          y: (labelBBox.minY + labelBBox.maxY) / 2,
          r: 5,
          stroke: '#000'
        },
        name: 'circle-shape',
        draggable: true
      });
      const bboxWidth = label.getBBox().width + 20;
      rect.attr({ width: bboxWidth });

      group.addShape('path', {
        attrs: {
          lineWidth: 1,
          fill: '#ccc',
          stroke: '#ccc',
          path: [
            ['M', 0, 0],
            ['L', bboxWidth, 0]
          ]
        },
        name: 'path-shape',
        draggable: true
      });

      return rect;
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5]
      ];
    }
  });
};

// 注册图节点
export const registerGraphIconFontNode = (): void => {
  G6.registerNode('iconFont', {
    draw(config: any, group: any) {
      const { style, labelCfg, iconCfg, size, label } = config;
      const keyShape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: size,
          lineWidth: 1,
          fill: style.stroke,
          stroke: style.stroke,
          fillOpacity: style.fillOpacity
        },
        name: 'circle-shape'
      });
      // iconFont
      group.addShape('text', {
        attrs: {
          x: 0,
          y: 0,
          fontFamily: 'iconfont-jiraiya', // 对应css里面的font-family: "iconfont";
          textAlign: 'center',
          textBaseline: 'middle',
          text: iconCfg.text,
          fontSize: size,
          fill: iconCfg.fill,
          opacity: 1
        },
        visible: iconCfg.visible,
        name: 'text-shape1',
        draggable: true
      });
      // label
      const labelPosition = {
        x: 0,
        y: labelCfg.position === 'center' ? 0 : labelCfg.position === 'top' ? -size - 8 : size + 8
      };
      group.addShape('text', {
        attrs: {
          ...labelCfg.style,
          ...labelPosition,
          textAlign: 'center',
          textBaseline: 'middle',
          text: label,
          fill: labelCfg.style.fill,
          fontSize: labelCfg.style.fontSize
        },
        draggable: true,
        visible: labelCfg.visible,
        name: 'text-shape2'
      });
      return keyShape;
    },
    setState(name: string | undefined, value: string | boolean | undefined, item: any) {
      if (item) {
        const group = item.getContainer();
        const shape = group && group.get('children') && group.get('children').length > 0 ? group.get('children')[0] : null;
        if (name === 'click' && shape) {
          if (value) {
            shape.attr('lineWidth', 3);
            shape.attr('fillOpacity', 0.8);
          } else {
            shape.attr('lineWidth', 1);
            shape.attr('fillOpacity', 0.6);
          }
        }
      }
    }
  });
};
