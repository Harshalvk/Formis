"use server";

import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createSubscription({ userId }: { userId: string }) {
  await db
    .update(users)
    .set({
      subscribed: true,
    })
    .where(eq(users.id, userId));
}

export async function deleteSubscription({ userId }: { userId: string }) {
  await db
    .update(users)
    .set({
      subscribed: false,
    })
    .where(eq(users.id, userId));
}
