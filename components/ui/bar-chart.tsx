"use client";

import { BarChart as Chart } from "@tremor/react";

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  colors?: string[];
  className?: string;
}

export function BarChart({
  data,
  xAxisKey,
  yAxisKey,
  colors = ["hsl(var(--primary))"],
  className,
}: BarChartProps) {
  return (
    <Chart
      data={data}
      index={xAxisKey}
      categories={[yAxisKey]}
      colors={colors}
      className={className}
      showLegend={false}
      yAxisWidth={48}
    />
  );
}