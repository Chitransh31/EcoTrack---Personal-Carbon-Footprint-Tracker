"use client";

type Period = "week" | "month" | "year";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

export default function PeriodSelector({
  value,
  onChange,
}: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === period.value
              ? "bg-eco-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

export type { Period };
