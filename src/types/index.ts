export type Category = "transport" | "energy" | "food";

export type TransportType = "car" | "bus" | "train" | "flight" | "bike" | "walk";
export type EnergyType = "electricity" | "natural_gas" | "heating_oil";
export type FoodType = "meat" | "dairy" | "vegetables" | "vegan";
export type ActivityType = TransportType | EnergyType | FoodType;

export const ACTIVITY_TYPES: Record<Category, { value: ActivityType; label: string; unit: string }[]> = {
  transport: [
    { value: "car", label: "Car", unit: "km" },
    { value: "bus", label: "Bus", unit: "km" },
    { value: "train", label: "Train", unit: "km" },
    { value: "flight", label: "Flight", unit: "km" },
    { value: "bike", label: "Bike", unit: "km" },
    { value: "walk", label: "Walk", unit: "km" },
  ],
  energy: [
    { value: "electricity", label: "Electricity", unit: "kWh" },
    { value: "natural_gas", label: "Natural Gas", unit: "kWh" },
    { value: "heating_oil", label: "Heating Oil", unit: "kWh" },
  ],
  food: [
    { value: "meat", label: "Meat", unit: "servings" },
    { value: "dairy", label: "Dairy", unit: "servings" },
    { value: "vegetables", label: "Vegetables", unit: "servings" },
    { value: "vegan", label: "Vegan", unit: "servings" },
  ],
};

export const CATEGORY_LABELS: Record<Category, string> = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  transport: "#3b82f6",
  energy: "#f59e0b",
  food: "#22c55e",
};
