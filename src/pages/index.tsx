import { type NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect, SetStateAction } from "react";
// import { api } from "~/utils/api";
import { TrashIcon } from "@heroicons/react/outline";
import { env } from "~/env.mjs";
import Navbar from "~/components/navbar";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: env.NEXT_PUBLIC_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [pattern, setPattern] = useState("cross");
  const [query, setQuery] = useState("");

  //OpenAI integration
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [response, setResponse] = useState("");
  const [submit, setSubmit] = useState(false);

  //request openai from api endpoint

  useEffect(() => {
    async function fetchData() {
      if (submit) {
        const completion = await openai.createChatCompletion({
          model: model,
          messages: [{ role: "user", content: query }],
          temperature: 0,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
        });
        setResponse(completion?.data?.choices[0]?.message?.content || "");
      }
    }
    fetchData();
    setSubmit(false);
  }, [submit]);

  const handleMessageChange = (event: {
    target: { value: string | ((prevState: string) => string) };
  }) => {
    // 👇️ access textarea value
    setQuery(event.target.value);
  };

  const handleReset = () => {
    setQuery("");
    setResponse("");
  };

  const handleModels = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setModel(event.target.value);
  };

  const patternBG = () => {
    if (pattern === "cross") {
      setPattern("dots");
    } else if (pattern === "dots") {
      setPattern("paper");
    } else {
      setPattern("cross");
    }
  };

  const patternStyles = () => {
    const defaultPattern =
      "z-5  absolute h-[100vh] w-[100vw] pattern-gray-300 pattern-bg-gray-600 pattern-opacity-20 pattern-size-8";
    if (pattern === "cross") {
      return defaultPattern + " pattern-cross";
    } else if (pattern === "dots") {
      return defaultPattern + " pattern-dots";
    } else {
      return defaultPattern + " pattern-paper";
    }
  };

  return (
    <>
      <Navbar pattern={pattern} patternBG={patternBG} />
      <main className="overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 font-general dark:from-gray-800 dark:to-gray-900">
        <div className={patternStyles()}></div>
        <div className="relative z-10 grid min-h-screen grid-cols-10">
          <div className="col-span-3">Col1</div>
          <div className="z-10 col-span-4 ml-4 mr-4 flex h-full w-full grow flex-col shadow-lg lg:rounded-3xl">
            <p className="select-none font-semibold text-gray-400">CHATGPT:</p>
            <div className="mb-4 overflow-hidden rounded-lg bg-gray-200 shadow-inner">
              <div className="scrollbar max-h-40 overflow-y-scroll p-4 pb-4">
                <div className="select-none">
                  <div className="inline">
                    <img
                      src={
                        session
                          ? session.user.image
                          : "https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo="
                      }
                      className="mr-2 inline h-5 w-5 rounded-full sm:mb-1 "
                      alt="avatar"
                    ></img>
                    <div className="inline select-none font-semibold text-gray-500">
                      {session ? session.user.name : "Guest"}
                      {": "}
                    </div>
                  </div>
                  <span className="italic text-gray-400">{query}</span>
                </div>
                <div className=" relative mt-6">
                  <div className="sm:flex ">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                      className="mb-0.5 mr-2 inline h-5 w-5 sm:mb-0 sm:mt-0.5"
                      alt="ChatGPT"
                    ></img>
                    <div className="inline select-none font-semibold text-gray-800">
                      {model}:
                    </div>

                    <div className="mt-2 flex text-gray-700 sm:ml-2 sm:mt-0">
                      {response}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {response ? (
              <button
                className="mr-2 mb-2 rounded-xl border border-gray-300 bg-gray-200 p-2 px-3 duration-150 ease-in-out hover:bg-gray-300 sm:px-4"
                onClick={() => handleReset()}
              >
                <TrashIcon className="mb-1 inline h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            ) : (
              <></>
            )}
            <div>
              <textarea
                id="message"
                name="message"
                value={query}
                onChange={handleMessageChange}
                className="h-24 w-full rounded-lg bg-gray-200 p-4 text-gray-900 shadow-inner focus:bg-gray-300 focus:outline-none"
              />
            </div>
            <button
              className="mb-2 mr-3 rounded-xl border border-green-300 bg-green-200 p-2 px-3 duration-150 ease-in-out hover:bg-green-300 sm:px-4"
              onClick={() => setSubmit(!submit)}
            >
              <img
                src="https://cdn.cdnlogo.com/logos/c/38/ChatGPT.svg"
                className="mb-1 inline h-4 w-4 sm:mr-1"
              ></img>
              <div className="hidden text-gray-900 sm:inline">ChatGPT</div>
            </button>
            <div className="relative inline-block text-left text-black">
              <select
                onChange={handleModels}
                className="focus:shadow-outline block w-full appearance-none rounded-xl border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
              >
                <option>gpt-3.5-turbo</option>
                <option>gpt-4</option>
                {/* <option>text-davinci-003</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.95 7.95l-3.54 3.54-3.54-3.54-1.41 1.41 3.54 3.54-3.54 3.54 1.41 1.41 3.54-3.54 3.54 3.54 1.41-1.41-3.54-3.54 3.54-3.54z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-span-3">Col1</div>
        </div>
      </main>
    </>
  );
};

export default Home;
