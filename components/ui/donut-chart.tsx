"use client";

import { DonutChart as Chart } from "@tremor/react";

interface DonutChartProps {
  data: any[];
  index: string;
  category: string;
  valueFormatter?: (value: number) => string;
  colors?: string[];
  className?: string;
}

export function DonutChart({
  data,
  index,
  category,
  valueFormatter,
  colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ],
  className,
}: DonutChartProps) {
  return (
    <Chart
      data={data}
      index={index}
      category={category}
      valueFormatter={valueFormatter}
      colors={colors}
      className={className}
      variant="donut"
    />
  );
}