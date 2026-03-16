import { db } from "./db";
import { emissionFactors } from "./db/schema";
import { eq, and } from "drizzle-orm";

export function calculateCO2e(factor: number, quantity: number): number {
  return Math.round(factor * quantity);
}

export async function getEmissionFactor(
  category: string,
  activityType: string
) {
  const result = await db
    .select()
    .from(emissionFactors)
    .where(
      and(
        eq(emissionFactors.category, category),
        eq(emissionFactors.activityType, activityType)
      )
    )
    .get();

  return result;
}

export function formatCO2e(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}
