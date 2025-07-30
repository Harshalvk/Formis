import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="text-2xl sm:text-3xl font-bold tracking-tighter"
    >
      Formis
    </Link>
  );
};

export default Logo;
