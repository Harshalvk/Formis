import React from "react";
import { auth, signIn } from "@/auth";
import ManageSubscriptions from "./_components/ManageSubscriptions";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

type Props = {};

const page = async (props: Props) => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    signIn();
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  const plan = user?.subscribed ? "premium" : "free";

  return (
    <div className="border p-5 rounded-md flex flex-col gap-2">
      <h1 className="text-3xl tracking-tight">Subscription Details</h1>
      <p>You currently are on a {plan} plan</p>
      <ManageSubscriptions />
    </div>
  );
};

export default page;
