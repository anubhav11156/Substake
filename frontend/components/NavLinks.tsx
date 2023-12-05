"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinksProps {
  className?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ className }) => {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "STAKE",
      href: "/application/stake",
      active: pathname === "/application/stake",
    },
    {
      name: "UNSTAKE",
      href: "/application/unstake",
      active: pathname === "/application/unstake",
    },
    {
      name: "TRANSACTION",
      href: "/application/transaction",
      active: pathname === "/application/transaction",
    },
  ];

  return (
    <nav>
      <ul className={cn(className, "flex items-center gap-8")}>
        {navLinks.map((navLink) => (
          <li key={navLink.name}>
            <Link
              href={navLink.href}
              className={cn(
                "text-gray-500 hover:text-black font-thin cursor-pointer text-base transition-all ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 rounded-md",
                {
                  "text-black": navLink.active,
                }
              )}
            >
              {navLink.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
