"use client";

import AutoSizer from "react-virtualized-auto-sizer";
import { EchartsCore, type Props } from "./EchartsCore";

export const Echarts: React.FC<Omit<Props, "width" | "height">> = (props) => {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <EchartsCore width={width} height={height} {...props} />
      )}
    </AutoSizer>
  );
};
