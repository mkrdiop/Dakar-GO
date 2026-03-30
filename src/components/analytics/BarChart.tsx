"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesData } from "@/lib/types";
import { useEffect, useRef } from "react";

interface BarChartProps {
  title: string;
  description?: string;
  data: TimeSeriesData[];
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function BarChart({
  title,
  description,
  data,
  className,
  valuePrefix = "",
  valueSuffix = "",
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));
    const scale = chartHeight / maxValue;

    // Bar width based on data length
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = item.value * scale;
      const x = padding.left + index * (barWidth + barSpacing);
      const y = height - padding.bottom - barHeight;

      // Draw bar
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.date, x + barWidth / 2, height - padding.bottom + 15);

      // Draw value
      ctx.fillStyle = "#1f2937";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `${valuePrefix}${item.value.toLocaleString()}${valueSuffix}`,
        x + barWidth / 2,
        y - 5
      );
    });

    // Draw axes
    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

  }, [data, valuePrefix, valueSuffix]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}