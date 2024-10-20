import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import UserAccount from "./UserAccount";

type Props = {};

const Header = async (props: Props) => {
  const session = await auth();

  return (
    <header className="border-b bottom-1">
      <nav className="flex p-2 items-center justify-between">
        <div>
          <h1 className="font-semibold text-lg lg:text-3xl md:text-2xl">
            Formis
          </h1>
        </div>
        <div className="flex gap-2">
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
