import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { activityUpdateSchema } from "@/lib/validations";
import { getEmissionFactor, calculateCO2e } from "@/lib/emissions";
import { eq } from "drizzle-orm";
import { ACTIVITY_TYPES, type Category } from "@/types";

async function getOwnedActivity(id: string, userId: string) {
  const activity = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .get();

  if (!activity) return { error: "Not found" as const, status: 404 };
  if (activity.userId !== userId) return { error: "Forbidden" as const, status: 403 };
  return { activity };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getOwnedActivity(id, session.user.id);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.activity);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getOwnedActivity(id, session.user.id);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const body = await request.json();
    const parsed = activityUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = parsed.data;
    const current = result.activity;

    const category = updates.category ?? current.category;
    const activityType = updates.activityType ?? current.activityType;
    const quantity = updates.quantity ?? current.quantity;

    // Validate activityType belongs to category
    const validTypes = ACTIVITY_TYPES[category as Category];
    const typeInfo = validTypes?.find((t) => t.value === activityType);
    if (!typeInfo) {
      return NextResponse.json(
        { error: "Invalid activity type for this category" },
        { status: 400 }
      );
    }

    // Recalculate CO2e if category, type, or quantity changed
    let co2e = current.co2e;
    if (updates.category || updates.activityType || updates.quantity) {
      const factor = await getEmissionFactor(category, activityType);
      if (!factor) {
        return NextResponse.json(
          { error: "Emission factor not found" },
          { status: 500 }
        );
      }
      co2e = calculateCO2e(factor.factor, quantity);
    }

    const updated = await db
      .update(activities)
      .set({
        category,
        activityType,
        quantity,
        unit: typeInfo.unit,
        co2e,
        date: updates.date ?? current.date,
        notes: updates.notes ?? current.notes,
      })
      .where(eq(activities.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getOwnedActivity(id, session.user.id);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await db.delete(activities).where(eq(activities.id, id));

  return new NextResponse(null, { status: 204 });
}
