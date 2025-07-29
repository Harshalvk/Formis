import React from "react";
import { auth } from "@/auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import UserAccount from "./UserAccount";
const Header = async () => {
  const session = await auth();

  return (
    <header className="border-b bottom-1 sticky top-0 z-50 bg-white/30 dark:bg-transparent backdrop-blur-md">
      <nav className="container flex p-2 items-center justify-between">
        <div>
          <h1 className="font-semibold text-lg lg:text-3xl md:text-2xl">
            Formis
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/view-forms">
            <Button variant={"link"}>Dashboard</Button>
          </Link>
          <ModeToggle />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <UserAccount user={session.user} />
            </div>
          ) : (
            <Link href={"/api/auth/signin"}>
              <Button variant={"link"}>Sign in</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
