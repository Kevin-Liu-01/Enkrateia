import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <button
          className="flex h-full w-full  items-center justify-center text-gray-900"
          role="button"
          onClick={() => setTheme("light")}
        >
          <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div>
          <MoonIcon />
        </button>
      );
    } else {
      return (
        <button
          className="flex h-full w-full  items-center justify-center  text-yellow-500"
          role="button"
          onClick={() => setTheme("dark")}
        >
          <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div>
          <SunIcon />
        </button>
      );
    }
  };
  return (
    <div className="flex flex-row items-center justify-center gap-4 bg-gray-200">
      <p className="text-center text-2xl text-white">
        <span>{sessionData?.user?.name || "Guest"}</span>
      </p>
      <img
        src={sessionData?.user?.image}
        alt="Profile Picture"
        className="rounded-full"
      />
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <div className="dark:border-apnea border-apneaLight relative mx-auto my-auto h-12 w-12 rounded-full border border-solid bg-gray-700 text-2xl hover:animate-spin">
        {renderThemeChanger()}
      </div>
    </div>
  );
};
export default Navbar;
