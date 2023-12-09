"use client";

import { memo, useEffect, useRef } from "react";

import type { EChartsOption } from "echarts";
import type { init, ECharts, ECElementEvent } from "echarts/core";

type Init = typeof init;
type InitParamters = Parameters<Init>;

export type Props = {
  width: number;
  height: number;
  className?: string;
  echarts: { init: Init } & Record<string, any>;
  theme?: InitParamters["1"];
  initOpts?: InitParamters["2"];
  loading?: boolean;
  loadingOpts?: object;
  options: EChartsOption;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onEvents?: Record<
    string,
    (params: ECElementEvent, instance: ECharts) => void
  >;
  style?: React.CSSProperties;
};

export const EchartsCore: React.FC<Props> = memo(
  ({
    width,
    height,
    className,
    echarts,
    theme,
    initOpts,
    loading = false,
    loadingOpts,
    options,
    notMerge = false,
    lazyUpdate = false,
    onEvents = {},
    ...props
  }) => {
    const container = useRef<HTMLDivElement>(null);
    const instance = useRef<ECharts | null>(null);
    const didMount = useRef<boolean>(false);

    // need to reinitialize
    useEffect(() => {
      if (didMount.current) {
        initEcharts();
      }
    }, [theme, initOpts]);

    // resize
    useEffect(() => {
      if (didMount.current) {
        instance.current?.resize({ width, height });
      }
    }, [width, height]);

    // update options
    useEffect(() => {
      if (didMount.current) {
        instance.current?.setOption(options, notMerge, lazyUpdate);
      }
    }, [options, notMerge, lazyUpdate]);

    // didMount: echarts init
    useEffect(() => {
      initEcharts();

      didMount.current = true;

      // unMount
      return () => {
        instance.current?.dispose();
        didMount.current = false;
      };
    }, []);

    // setOptions & loading
    useEffect(() => {
      if (loading) instance.current?.showLoading(loadingOpts);
      else instance.current?.hideLoading();
    }, [loading]);

    const initEcharts = () => {
      instance.current = echarts.init(container.current, theme, {
        width,
        height,
        ...initOpts,
      });

      instance.current?.setOption(options, notMerge, lazyUpdate);

      // bind events
      for (const event in onEvents) {
        if (Object.prototype.hasOwnProperty.call(onEvents, event)) {
          const func = onEvents[event]!;
          instance.current.on(event, (params) => {
            func(params as ECElementEvent, instance.current!);
          });
        }
      }
    };

    return (
      <div
        ref={container}
        className={className}
        style={{ width, height, ...props.style }}
      />
    );
  },
);
