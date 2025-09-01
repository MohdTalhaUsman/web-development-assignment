"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

function Navbar() {
  const currentPath = usePathname();

  return (
    <header className="py-[1.6em] bg-white">
      <nav className="flex justify-around space-x-[3em] w-[fit-content] mx-[auto]">
        <Link href="/">
          <h3
            className={`${
              currentPath === "/"
                ? "text-[var(--link-active-color)] bg-[var(--theme-color-1)] border-white shadow-[var(--link-active-shadow)]"
                : "text-[var(--link-color)] border-transparent bg-[#ffffff00]"
            } h-[3.6em] w-[8em] rounded-[1.2em] pt-[1em] text-center border-[2px] text-[1.5em] font-sans font-extrabold hover:text-[var(--link-active-color)] active:text-[var(--link-active-color)]`}
          >
            HOME
          </h3>
        </Link>
        <Link href="/addschool">
          <h3
            className={`${
              currentPath === "/addschool"
                ? "text-[var(--link-active-color)] bg-[var(--theme-color-1)] border-white shadow-[var(--link-active-shadow)]"
                : "text-[var(--link-color)] border-transparent bg-[#ffffff00]"
            } h-[3.6em] w-[8em] rounded-[1.2em] pt-[1em] text-center border-[2px] text-[1.5em] font-sans font-extrabold hover:text-[var(--link-active-color)] active:text-[var(--link-active-color)]`}
          >
            ADD SCHOOL
          </h3>
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
