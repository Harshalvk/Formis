import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Sign out</Button>
    </form>
  );
}

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
        {session?.user?.name && session.user.image ? (
          <div className="flex items-center gap-2">
            <Image
              src={session.user.image as string}
              alt="User profile"
              className=""
              width={40}
              height={40}
            />
            <SignOut />
          </div>
        ) : (
          <Link href={"/api/auth/signin"}>
            <Button variant={"link"}>Sign in</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
