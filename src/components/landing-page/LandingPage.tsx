"use client";

import { useEffect } from "react";
import FormGenerator from "../FormGenerator";
import { motion, stagger, useAnimate } from "motion/react";

const LandingPage = () => {
  const [scope, animate] = useAnimate();

  const startAnimating = () => {
    animate(
      "#hero",
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0
      },
      {
        delay: stagger(0.1, { startDelay: 0.2 }),
        duration: 0.3,
        ease: "easeInOut"
      }
    );
  };

  useEffect(() => {
    startAnimating();
  }, []);

  const animation = {
    initial: { y: 8, opacity: 0, filter: "blur(10px)" }
  };

  return (
    <section ref={scope} className="p-4">
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 2
          }}
          className="flex flex-col items-center justify-center space-y-4 p-28 w-full bg-[url('/grid-black.svg')] dark:bg-[url('/grid-white.svg')] absolute -top-14 bg-opacity-5 z-0"
        >
          <div
            className={`w-full absolute inset-0 bg-gradient-to-t from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-c from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
        </motion.div>
        <div className="mt-36">
          <motion.h1
            id="hero"
            initial={"initial"}
            variants={animation}
            className="z-10 text-4xl text-center font-semibold sm:text-5xl md:text-6xl tracking-tighter leading-6"
          >
            Forms built to grow <br className="block sm:hidden" /> with you.
          </motion.h1>
          <motion.p
            id="hero"
            initial={"initial"}
            variants={animation}
            className="z-10 mt-2 text-sm md:text-base max-w-2xl mx-auto text-center text-zinc-600 dark:text-zinc-300"
          >
            Generate and share your form in seconds.{" "}
            <span className={"italic"}>
              Explore rich analytics, <br /> visual charts, and actionable
              insights.
            </span>
          </motion.p>
          <div
            className={`w-full bg-gradient-to-b from-transparent z-0 dark:to-zinc-950 to-white h-24`}
          />
          <motion.div id="hero" initial={"initial"} variants={animation}>
            <FormGenerator chat={true} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
