// interface markPoint {
//   id: string;
//   coordinate: number[];
// }
// interface markLine {
//   title?: string;
//   startPoint: number[];
//   endPoint: number[];
// }
export interface initMapProps {
  mapContainerDomId: string;
  mapCenter?: [number, number];
}

export interface markPointProps {
  id: string;
  data?: {
    name: string;
  };
  coordinate: [number, number];
}

export interface markLineProps {
  title?: string;
  data?: {
    name: string;
  };
  lineCoordinates: [[number, number], [number, number]];
}
