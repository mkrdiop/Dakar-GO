"use client";

import { getAnalyticsData, analyticsPeriods } from "@/actions/analytics";
import { BarChart } from "@/components/analytics/BarChart";
import { MetricCard } from "@/components/analytics/MetricCard";
import { PerformanceCard } from "@/components/analytics/PerformanceCard";
import { PieChart } from "@/components/analytics/PieChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsDashboardData } from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon, BarChart3, Package, TrendingUp, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const analyticsData = await getAnalyticsData(selectedPeriod);
        setData(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Analysez les performances de vos livraisons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {analyticsPeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            Exporter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px] mb-2" />
                <Skeleton className="h-4 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Livraisons totales"
              value={data.deliveryMetrics.total}
              description={`${data.deliveryMetrics.completed} complétées`}
              icon={Package}
              trend={{ value: 12.5, positive: true }}
            />
            <MetricCard
              title="Chiffre d'affaires"
              value={formatCurrency(data.revenueMetrics.total)}
              description={`${formatCurrency(data.revenueMetrics.average)} par commande`}
              icon={TrendingUp}
              trend={{ value: data.revenueMetrics.growth, positive: true }}
            />
            <MetricCard
              title="En cours de livraison"
              value={data.deliveryMetrics.inTransit}
              description={`${data.deliveryMetrics.pending} en attente`}
              icon={Truck}
            />
            <MetricCard
              title="Taux d'annulation"
              value={`${Math.round((data.deliveryMetrics.cancelled / data.deliveryMetrics.total) * 100)}%`}
              description={`${data.deliveryMetrics.cancelled} commandes annulées`}
              icon={BarChart3}
              trend={{ value: 2.1, positive: false }}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <BarChart
              title="Livraisons par jour"
              description="Nombre de livraisons effectuées"
              data={data.deliveriesByDay}
            />
            <BarChart
              title="Chiffre d'affaires par jour"
              description="Revenus générés par les livraisons"
              data={data.revenueByDay}
              valuePrefix="XOF "
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <PieChart
              title="Distribution des véhicules"
              description="Types de véhicules utilisés pour les livraisons"
              data={data.vehicleDistribution}
            />
            <PieChart
              title="Top 5 lieux de ramassage"
              description="Zones les plus fréquentes pour les ramassages"
              data={data.topPickupLocations}
            />
            <PerformanceCard data={data.performanceMetrics} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
}