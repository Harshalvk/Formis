"use client";

import { User } from "next-auth";
import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import UserAccount from "../UserAccount";
import { motion } from "motion/react";

const NavbarContent = ({ user }: { user: User }) => {
  return (
    <motion.nav
      initial={{
        y: -40,
        opacity: 0,
        filter: "blur(4px)"
      }}
      animate={{
        y: 0,
        opacity: 1,
        filter: "blur(0px)"
      }}
      transition={{
        ease: "easeOut",
        duration: 0.3
      }}
      className="max-w-7xl mx-auto"
    >
      <div className="w-full h-fit flex items-center justify-center px-2 py-3">
        <div className="w-full flex items-center gap-5">
          <div>
            <Logo />
          </div>
          <div className="space-x-5 text-sm mt-1 hidden sm:block">
            <Link href={"#"}>Community</Link>
            <Link href={"#"}>Pricing</Link>
          </div>
        </div>
        <div>
          <UserAccount user={user} />
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarContent;
