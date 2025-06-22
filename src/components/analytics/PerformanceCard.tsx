"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetrics } from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon, Clock, Star } from "lucide-react";

interface PerformanceCardProps {
  data: PerformanceMetrics;
  className?: string;
}

export function PerformanceCard({ data, className }: PerformanceCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
        <CardDescription>
          Temps de livraison et satisfaction client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Temps de livraison moyen</p>
              <p className="text-2xl font-bold">{data.deliveryTime.average} min</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {data.deliveryTime.improvement > 0 ? (
              <ArrowDownIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={data.deliveryTime.improvement > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(data.deliveryTime.improvement)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Satisfaction client</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{data.customerSatisfaction.rating}</p>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(data.customerSatisfaction.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : i < data.customerSatisfaction.rating
                          ? "text-yellow-500 fill-yellow-500 opacity-50"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {data.customerSatisfaction.improvement > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={data.customerSatisfaction.improvement > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(data.customerSatisfaction.improvement)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}