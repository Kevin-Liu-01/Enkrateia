import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  DotsHorizontalIcon,
  PlusIcon,
  ViewGridIcon,
} from "@heroicons/react/solid";

const Navbar: React.FC = (props) => {
  const { data: sessionData } = useSession();
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <button
          className="flex items-center justify-center text-gray-900"
          role="button"
          onClick={() => setTheme("light")}
        >
          {/* <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div> */}
          <MoonIcon className="h-full w-full" />
        </button>
      );
    } else {
      return (
        <button
          className="flex items-center justify-center  text-yellow-500"
          role="button"
          onClick={() => setTheme("dark")}
        >
          {/* <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div> */}
          <SunIcon className="h-full w-full" />
        </button>
      );
    }
  };

  const patternSelector = () => {
    if (props.pattern == "cross") {
      return <PlusIcon className="h-full w-full" />;
    } else if (props.pattern == "dots") {
      return <DotsHorizontalIcon className="h-full w-full" />;
    } else {
      return <ViewGridIcon className="h-full w-full" />;
    }
  };
  return (
    <nav className="overflow-hidden border-b border-gray-600 bg-gray-200 font-general dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl flex-row justify-center">
        <div>
          <Image
            src="/images/socrates.png"
            alt="Socrates"
            height={500}
            width={500}
            className="inline-block h-16 w-auto"
          />
          <h1 className="absolute mt-4 inline text-2xl font-extrabold tracking-tight text-white  lg:text-[4rem]">
            Enkrateia <span className="text-gpt">GPT-4</span>
          </h1>
        </div>
        <div className="ml-auto flex ">
          <div className="flex h-full items-center border-l border-gray-600 py-2 px-2 dark:text-white">
            <span className="text-xl">
              {sessionData?.user?.name || "Guest"}
            </span>
            <img
              src={sessionData?.user?.image}
              alt="Profile Picture"
              className="my-auto ml-2 inline h-12 w-12 rounded-full"
            />{" "}
          </div>

          <button
            className=" h-full border-l border-gray-600 px-2 font-semibold no-underline duration-150 hover:bg-white/10"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign Out" : "Sign In"}
          </button>
          <button
            className="h-full border-l border-gray-600 px-2 duration-150 hover:bg-white/10"
            onClick={() => props.patternBG()}
          >
            <div className="h-10 w-10">{patternSelector()}</div>
          </button>
          <div className="relative flex h-full items-center justify-center border-l border-gray-600 px-2 duration-150 hover:bg-white/10">
            <div className="h-12 w-12 rounded-full bg-gray-100 text-2xl hover:animate-spin hover:bg-transparent dark:bg-gray-700 dark:hover:bg-transparent">
              {renderThemeChanger()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
