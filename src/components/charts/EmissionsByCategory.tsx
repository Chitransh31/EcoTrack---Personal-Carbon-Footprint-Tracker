"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from "@/types";

interface CategoryData {
  category: string;
  total: number;
}

export default function EmissionsByCategory({
  data,
}: {
  data: CategoryData[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No data to display
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: CATEGORY_LABELS[d.category as Category] || d.category,
    value: Math.round(d.total / 1000 * 10) / 10, // Convert to kg
    color: CATEGORY_COLORS[d.category as Category] || "#6b7280",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value} kg`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} kg CO2e`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
