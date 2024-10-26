"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/app/types/nav-types";
import { cn } from "@/lib/utils";
import { Icons } from "../Icons";

interface DashboradNavProps {
  items: SidebarNavItem[];
}

const Navbar = ({ items }: DashboradNavProps) => {
  const path = usePathname();

  if (!items.length) return null;

  return (
    <nav>
      {items.map((item, index) => {
        const Icon = Icons[item?.icon || "list"];
        const isActive = path === item.href;
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : `${item.href}`}>
              <span
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent" : "transparent",
                  item.disabled
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.title}
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
};

export default Navbar;