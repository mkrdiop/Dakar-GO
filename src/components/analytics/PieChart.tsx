"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationMetrics, VehicleMetrics } from "@/lib/types";
import { useEffect, useRef } from "react";

interface PieChartProps {
  title: string;
  description?: string;
  data: (VehicleMetrics | LocationMetrics)[];
  className?: string;
  colors?: string[];
}

export function PieChart({
  title,
  description,
  data,
  className,
  colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ],
}: PieChartProps) {
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
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.count, 0);

    // Draw pie chart
    let startAngle = 0;
    data.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.count) / total;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 1.2;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(midAngle) * radius,
        centerY + Math.sin(midAngle) * radius
      );
      ctx.lineTo(labelX, labelY);
      ctx.strokeStyle = colors[index % colors.length];
      ctx.stroke();

      // Draw text
      ctx.fillStyle = "#1f2937";
      ctx.font = "10px sans-serif";
      ctx.textAlign = midAngle < Math.PI ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `${item.name || item.type} (${item.percentage}%)`,
        labelX + (midAngle < Math.PI ? 5 : -5),
        labelY
      );

      startAngle = endAngle;
    });

  }, [data, colors]);

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
        <div className="mt-4 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm">
                {item.name || item.type}: {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}