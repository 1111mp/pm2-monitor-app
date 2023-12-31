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
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { swrApi } from "@/trpc/react";

import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

export const Content: React.FC<{}> = () => {
  const xDraft = useRef<number[]>();
  const yDraft = useRef<number[]>(new Array(61));
  const duration = useRef<number>(0);

  const { data, isLoading } = swrApi.pm2.list.useSWR(undefined, {
    refreshInterval: 1000,
    revalidateOnFocus: false,
  });

  console.log("data", data);

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
    const { monit } = apps[1]!;

    yDraft.current.push(monit?.cpu!);
    yDraft.current.shift();

    return [...yDraft.current];
  }, [data]);

  const options: EChartsOption = useMemo(() => {
    return {
      animationEasing: "linear",
      animationEasingUpdate: "linear",
      animationDuration: duration.current,
      animationDurationUpdate: duration.current,
      title: {
        text: "CPU Usage",
      },
      tooltip: {
        trigger: "axis",
        formatter(params) {
          const { marker, name, data } = (params as CallbackDataParams[])[0]!;
          return `${new Date(
            parseInt(name),
          ).toLocaleTimeString()} <br/ > <p style="display:flex;justify-content:space-between;align-items:center;">${marker} ${data}%</p>`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
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
        max({ max }) {
          return Math.min(max + 2, 100);
        },
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [
        {
          type: "line",
          smooth: true,
          // areaStyle: {},
          itemStyle: {
            color: "#333",
          },
          data: yData,
        },
      ],
    };
  }, [data]);

  return <Echarts echarts={echarts} options={options} loading={isLoading} />;
};
