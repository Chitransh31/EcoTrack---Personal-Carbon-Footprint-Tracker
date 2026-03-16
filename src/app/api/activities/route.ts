import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { activitySchema, activityQuerySchema } from "@/lib/validations";
import { getEmissionFactor, calculateCO2e } from "@/lib/emissions";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { ACTIVITY_TYPES, type Category } from "@/types";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = activityQuerySchema.safeParse({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  if (!query.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const conditions = [eq(activities.userId, session.user.id)];

  if (query.data.from) {
    conditions.push(gte(activities.date, query.data.from));
  }
  if (query.data.to) {
    conditions.push(lte(activities.date, query.data.to));
  }
  if (query.data.category) {
    conditions.push(eq(activities.category, query.data.category));
  }

  const result = await db
    .select()
    .from(activities)
    .where(and(...conditions))
    .orderBy(desc(activities.date), desc(activities.createdAt));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = activitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { category, activityType, quantity, date, notes } = parsed.data;

    // Validate activityType belongs to category
    const validTypes = ACTIVITY_TYPES[category as Category];
    const typeInfo = validTypes?.find((t) => t.value === activityType);
    if (!typeInfo) {
      return NextResponse.json(
        { error: "Invalid activity type for this category" },
        { status: 400 }
      );
    }

    const factor = await getEmissionFactor(category, activityType);
    if (!factor) {
      return NextResponse.json(
        { error: "Emission factor not found" },
        { status: 500 }
      );
    }

    const co2e = calculateCO2e(factor.factor, quantity);

    const result = await db
      .insert(activities)
      .values({
        userId: session.user.id,
        category,
        activityType,
        quantity,
        unit: typeInfo.unit,
        co2e,
        date,
        notes,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
