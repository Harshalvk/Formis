"use client";
import React, { useEffect, useState } from "react";
import FormGenerator from "../FormGenerator";
import { useTheme } from "next-themes";

type Props = {};

const LandingPage = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  return (
    <section className="flex flex-col items-center justify-center space-y-4 sm:pt-28 w-full bg-[url('/grid-black.svg')] dark:bg-[url('/grid-white.svg')] relative bg-opacity-5 z-0">
      <div
        className={`w-full absolute inset-0 bg-gradient-to-t from-transparent via-transparent z-0 ${
          theme === "dark" ? "to-zinc-950" : "to-white"
        }`}
      />
      <div
        className={`w-full absolute inset-0 bg-gradient-to-c from-transparent via-transparent z-0 ${
          theme === "dark" ? "to-zinc-950" : "to-white"
        }`}
      />
      <div
        className={`w-full absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-0 ${
          theme === "dark" ? "to-zinc-950" : "to-white"
        }`}
      />
      <h1 className="z-10 text-4xl text-center font-semibold sm:text-5xl md:text-6xl tracking-tighter leading-6">
        Forms built to grow with you.
      </h1>
      <p className="z-10 mt-2 sm:text-xl max-w-2xl mx-auto text-center text-zinc-600 dark:text-zinc-300">
        Generate and share your form in seconds. <br /> Explore rich analytics,
        visual charts, and actionable insights.
      </p>
      <FormGenerator />
      <div
        className={`w-full bg-gradient-to-b from-transparent z-0${
          theme === "dark" ? "to-zinc-950" : "to-white"
        } h-24`}
      />
    </section>
  );
};

export default LandingPage;
