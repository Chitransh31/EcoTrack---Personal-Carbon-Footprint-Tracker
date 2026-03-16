"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { CATEGORY_LABELS, type Category } from "@/types";

interface Activity {
  id: string;
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
  co2e: number;
  date: string;
  notes: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  transport: "🚗",
  energy: "⚡",
  food: "🍽️",
};

export default function ActivityList({
  activities,
}: {
  activities: Activity[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (activities.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="text-lg">No activities logged yet.</p>
        <p className="mt-1 text-sm">
          Start by logging your first activity!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Activity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              CO2e
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {activity.date}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className="mr-1">
                  {CATEGORY_ICONS[activity.category] || ""}
                </span>
                {CATEGORY_LABELS[activity.category as Category] ||
                  activity.category}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-700">
                {activity.activityType.replace("_", " ")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                {activity.quantity} {activity.unit}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {activity.co2e >= 1000
                  ? `${(activity.co2e / 1000).toFixed(1)} kg`
                  : `${activity.co2e} g`}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(activity.id)}
                  isLoading={deletingId === activity.id}
                  className="text-xs"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
