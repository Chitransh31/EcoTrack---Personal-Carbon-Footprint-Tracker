import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ActivityList from "@/components/ActivityList";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, session.user.id))
    .orderBy(desc(activities.date), desc(activities.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
        <Link href="/dashboard/log">
          <Button>Log Activity</Button>
        </Link>
      </div>
      <ActivityList activities={userActivities} />
    </div>
  );
}
