"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {};

const ManageSubscriptions = (props: Props) => {
  const router = useRouter();

  const redirectToCustomerPortal = async () => {
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { url } = await response.json();
      router.push(url.url);
    } catch (error: any) {
      console.error("Error redirecting to customer portal", error);
    }
  };

  return (
    <Button onClick={redirectToCustomerPortal} className="max-w-fit">
      Change your subscription
    </Button>
  );
};

export default ManageSubscriptions;
