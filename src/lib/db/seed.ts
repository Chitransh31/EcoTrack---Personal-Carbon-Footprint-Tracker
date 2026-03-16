import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { emissionFactors } from "./schema";

const sqlite = new Database("ecotrack.db");
const db = drizzle(sqlite);

const factors = [
  // Transport (per km)
  { category: "transport", activityType: "car", factor: 170, unit: "km", source: "DEFRA 2023 - Average petrol car" },
  { category: "transport", activityType: "bus", factor: 89, unit: "km", source: "DEFRA 2023 - Local bus per passenger-km" },
  { category: "transport", activityType: "train", factor: 41, unit: "km", source: "DEFRA 2023 - National rail per passenger-km" },
  { category: "transport", activityType: "flight", factor: 255, unit: "km", source: "DEFRA 2023 - Short-haul flight per passenger-km" },
  { category: "transport", activityType: "bike", factor: 0, unit: "km", source: "Zero direct emissions" },
  { category: "transport", activityType: "walk", factor: 0, unit: "km", source: "Zero direct emissions" },

  // Energy (per kWh)
  { category: "energy", activityType: "electricity", factor: 420, unit: "kWh", source: "Global average grid intensity" },
  { category: "energy", activityType: "natural_gas", factor: 205, unit: "kWh", source: "Natural gas combustion" },
  { category: "energy", activityType: "heating_oil", factor: 270, unit: "kWh", source: "Heating oil per kWh equivalent" },

  // Food (per serving)
  { category: "food", activityType: "meat", factor: 3000, unit: "servings", source: "Beef-equivalent meal ~300g" },
  { category: "food", activityType: "dairy", factor: 1200, unit: "servings", source: "Cheese/milk-heavy meal" },
  { category: "food", activityType: "vegetables", factor: 500, unit: "servings", source: "Mixed vegetable meal" },
  { category: "food", activityType: "vegan", factor: 400, unit: "servings", source: "Fully plant-based meal" },
];

async function seed() {
  console.log("Seeding emission factors...");
  await db.delete(emissionFactors);
  await db.insert(emissionFactors).values(factors);
  console.log(`Seeded ${factors.length} emission factors.`);
  sqlite.close();
}

seed().catch(console.error);
