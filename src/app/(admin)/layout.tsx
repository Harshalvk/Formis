import Header from "@/components/Header";
import Navbar from "@/components/navigation/Navbar";
import React from "react";
import { SidebarNavItem } from "../types/nav-types";
import { SessionProvider } from "next-auth/react";
import FormGenerator from "@/components/FormGenerator";
import UpgradeAccBtn from "@/components/navigation/UpgradeAccBtn";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dashboradConfig: {
    sidebarNav: SidebarNavItem[];
  } = {
    sidebarNav: [
      {
        title: "My Forms",
        href: "/view-forms",
        icon: "library",
      },
      {
        title: "Results",
        href: "/results",
        icon: "list",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: "lineChart",
      },
      {
        title: "Charts",
        href: "/charts",
        icon: "pieChart",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
      },
    ],
  };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className=" grid md:grid-cols-[200px_1fr] flex-1">
        <aside className="hidden w-[200px] flex-col md:flex px-2 py-2 border-r justify-between ">
          <Navbar items={dashboradConfig.sidebarNav} />
          <UpgradeAccBtn />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <header className="flex items-center">
            <h1 className="text-4xl m-5 p-4 font-semibold">Dashboard</h1>
            <SessionProvider>
              <FormGenerator />
            </SessionProvider>
          </header>
          <hr className="" />
          <div className="m-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
