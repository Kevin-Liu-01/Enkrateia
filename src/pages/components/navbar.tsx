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
  LoginIcon,
  LogoutIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";

const Navbar = (props: { pattern: string; patternBG: () => void }) => {
  const { data: session } = useSession();
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
          className="flex h-full w-full items-center justify-center text-purple-500"
          role="button"
          onClick={() => setTheme("light")}
        >
          {/* <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div> */}
          <MoonIcon className="h-8 w-8" />
        </button>
      );
    } else {
      return (
        <button
          className="flex h-full w-full items-center justify-center  text-orange-300 hover:text-yellow-300"
          role="button"
          onClick={() => setTheme("dark")}
        >
          {/* <div className="rings-halo absolute z-50 h-full w-full bg-contain bg-center bg-no-repeat opacity-70"></div> */}
          <SunIcon className="h-8 w-8" />
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
    <nav className="border-b border-gray-600 bg-gray-100 font-general text-gray-900 shadow-lg dark:bg-gray-800 dark:text-gray-400">
      <div className="flex flex-row justify-center">
        <div>
          <Image
            src="/images/socrates.png"
            alt="Socrates"
            height={500}
            width={500}
            className="inline-block h-16 w-auto"
          />
          <h1 className="absolute top-0 mt-4 inline text-2xl font-extrabold tracking-tight dark:text-white lg:text-[3.5rem]">
            <span className="">Enkrateia </span>
            <span className="text-gpt">GPT-4</span>
          </h1>
        </div>
        <div className="ml-auto flex ">
          <div className="flex h-full items-center py-2 px-2 dark:text-white">
            <span className="text-xl">{session?.user?.name || "Guest"}</span>
            <div className="relative my-auto ml-2 inline h-10 w-10 rounded-full border-[1.5px] border-gray-900 dark:border-white">
              {session?.user.image ? (
                <Image
                  src={session?.user.image}
                  alt="Profile Picture"
                  className="relative h-full w-full rounded-full"
                  height={500}
                  width={500}
                />
              ) : (
                <UserCircleIcon className="relative h-full w-full rounded-full dark:text-white" />
              )}
              <div className="absolute right-0 bottom-0 h-2 w-2 rounded-full border-[1.5px] border-gray-900 bg-green-500 dark:border-white"></div>
            </div>
          </div>

          <button
            className=" h-full border-l border-gray-600 px-2 font-semibold no-underline duration-150 hover:bg-gray-300 dark:hover:bg-white/10"
            onClick={session ? () => void signOut() : () => void signIn()}
          >
            {session ? (
              <LogoutIcon className="h-8 w-8" />
            ) : (
              <LoginIcon className="h-8 w-8" />
            )}
          </button>
          <button
            className="h-full border-l border-gray-600 px-2 duration-150 hover:bg-gray-300 dark:hover:bg-white/10"
            onClick={() => props.patternBG()}
          >
            <div className="h-8 w-8">{patternSelector()}</div>
          </button>
          <div className="relative flex h-full items-center justify-center border-l border-gray-600 px-2 duration-150 hover:bg-gray-300 dark:hover:bg-white/10">
            {renderThemeChanger()}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;