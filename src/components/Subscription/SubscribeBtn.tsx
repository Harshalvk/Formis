"use client";
import React from "react";
import { getStripe } from "@/lib/stripe-client";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

type Props = {
  userId?: string;
  price: number;
};

const SubscribeBtn = ({ userId, price }: Props) => {
  const router = useRouter();

  const handleCheckout = async (price: number) => {
    if (!userId) {
      router.push("/login");
    }

    try {
      const { sessionId } = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      }).then((res) => res.json());

      console.log("sessionId: ", sessionId);
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <Button variant={"link"} onClick={() => handleCheckout(price)}>
      Upgrade your plan
    </Button>
  );
};

export default SubscribeBtn;
