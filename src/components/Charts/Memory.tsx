"use client";

import { useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { Echarts } from "../Echarts";
import { LineChart } from "echarts/charts";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { parseKMToMB } from "./utils";

import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import type { ProcessDescription } from "pm2";

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  VisualMapComponent,
  LineChart,
  CanvasRenderer,
]);

type Props = {
  isLoading?: boolean;
  data?: {
    timer: number;
    apps: ProcessDescription[];
  };
};

export const Memory: React.FC<Props> = ({ isLoading = false, data }) => {
  const xDraft = useRef<number[]>();
  const yDraft = useRef<number[]>(new Array(61));
  const duration = useRef<number>(0);

  const xAxis = useMemo(() => {
    if (!data) return [];

    const { timer } = data;
    if (!xDraft.current) {
      let now = timer,
        xAxis = [now];
      for (let i = 0; i < 60; i++) {
        now -= 1000;
        xAxis.unshift(now);
      }
      xDraft.current = xAxis;
      duration.current = 300;
      return xAxis;
    }

    duration.current = timer - xDraft.current[xDraft.current.length - 1]!;

    xDraft.current.push(timer);
    xDraft.current.shift();

    return [...xDraft.current];
  }, [data]);

  const yData = useMemo(() => {
    if (!data) return [];

    const { apps } = data;
    const { monit } = apps[0]!;

    yDraft.current.push(parseKMToMB(monit?.memory!));
    yDraft.current.shift();

    return [...yDraft.current];
  }, [data]);

  const options: EChartsOption | undefined = useMemo(() => {
    if (!data) return {};

    const { apps } = data;
    const { pm2_env } = apps[0]!;
    const { max_memory_restart } = pm2_env as any;
    const max = max_memory_restart ? parseKMToMB(max_memory_restart) : 200;

    return {
      animationEasing: "linear",
      animationEasingUpdate: "linear",
      animationDuration: duration.current,
      animationDurationUpdate: duration.current,
      title: {
        text: `Memory Usage ${yData[yData.length - 1]}M`,
        textStyle: {
          color: "#999",
        },
      },
      visualMap: [
        {
          show: false,
          type: "continuous",
          seriesIndex: 0,
          min: 0,
          max,
          inRange: {
            color: ["#006FEE", "#f5a524", "#f31260"],
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter(params) {
          const { marker, name, data } = (params as CallbackDataParams[])[0]!;
          return `${new Date(
            parseInt(name),
          ).toLocaleTimeString()} <br/ > <p style="display:flex;justify-content:space-between;align-items:center;">${marker} ${data}M</p>`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        boundaryGap: false,
        data: xAxis,
        axisLabel: {
          formatter(val) {
            return new Date(parseInt(val)).toLocaleTimeString();
          },
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max({ max: curMax }) {
          return Math.min(curMax + 20, max);
        },
        axisLabel: {
          formatter: "{value}M",
        },
      },
      series: [
        {
          type: "line",
          smooth: true,
          areaStyle: {
            opacity: 0.3,
          },
          // itemStyle: {
          //   color: "#333",
          // },
          data: yData,
        },
      ],
    };
  }, [data]);

  return <Echarts echarts={echarts} options={options} loading={isLoading} />;
};
