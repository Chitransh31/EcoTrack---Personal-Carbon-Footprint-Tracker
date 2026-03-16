"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmissionsByCategory from "@/components/charts/EmissionsByCategory";
import EmissionsTrend from "@/components/charts/EmissionsTrend";
import PeriodSelector, { type Period } from "@/components/charts/PeriodSelector";
import { CATEGORY_LABELS, type Category } from "@/types";

interface Activity {
  id: string;
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
  co2e: number;
  date: string;
}

function getDateRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().split("T")[0];

  let from: Date;
  switch (period) {
    case "week":
      from = new Date(now);
      from.setDate(from.getDate() - 7);
      break;
    case "month":
      from = new Date(now);
      from.setMonth(from.getMonth() - 1);
      break;
    case "year":
      from = new Date(now);
      from.setFullYear(from.getFullYear() - 1);
      break;
  }

  return { from: from.toISOString().split("T")[0], to };
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    const { from, to } = getDateRange(period);
    try {
      const res = await fetch(`/api/activities?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Aggregate by category
  const categoryData = Object.entries(
    activities.reduce(
      (acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + a.co2e;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([category, total]) => ({ category, total }));

  // Aggregate by date for trend
  const trendData = Object.entries(
    activities.reduce(
      (acc, a) => {
        acc[a.date] = (acc[a.date] || 0) + a.co2e;
        return acc;
      },
      {} as Record<string, number>
    )
  )
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalCO2e = activities.reduce((sum, a) => sum + a.co2e, 0);
  const totalKg = (totalCO2e / 1000).toFixed(1);
  const activityCount = activities.length;

  // Top source
  const topCategory = categoryData.sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Your carbon footprint overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Link href="/dashboard/log">
            <Button>Log Activity</Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-gray-600">Total Emissions</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {totalKg} <span className="text-lg font-normal">kg CO2e</span>
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-600">
            Activities Logged
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {activityCount}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-600">
            Top Emission Source
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {topCategory
              ? CATEGORY_LABELS[topCategory.category as Category]
              : "N/A"}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Emissions by Category
          </h2>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <EmissionsByCategory data={categoryData} />
          )}
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Emissions Trend
          </h2>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <EmissionsTrend data={trendData} />
          )}
        </Card>
      </div>
    </div>
  );
}
