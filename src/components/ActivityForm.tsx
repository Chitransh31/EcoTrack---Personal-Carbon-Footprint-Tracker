"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Card from "./ui/Card";
import { ACTIVITY_TYPES, CATEGORY_LABELS, type Category } from "@/types";

export default function ActivityForm() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | "">("");
  const [activityType, setActivityType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  const typeOptions = category
    ? ACTIVITY_TYPES[category].map((t) => ({ value: t.value, label: t.label }))
    : [];

  const selectedType = category
    ? ACTIVITY_TYPES[category].find((t) => t.value === activityType)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          activityType,
          quantity: Number(quantity),
          date,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to log activity");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Log Activity</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Select
          id="category"
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            setActivityType("");
          }}
          options={categoryOptions}
          placeholder="Select a category"
          required
        />

        {category && (
          <Select
            id="activityType"
            label="Activity Type"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            options={typeOptions}
            placeholder="Select an activity"
            required
          />
        )}

        {activityType && (
          <Input
            id="quantity"
            label={`Quantity (${selectedType?.unit || ""})`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter amount"
            min="0.1"
            step="0.1"
            required
          />
        )}

        <Input
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
        />

        <Input
          id="notes"
          label="Notes (optional)"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes..."
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={!category || !activityType || !quantity}
        >
          Log Activity
        </Button>
      </form>
    </Card>
  );
}
