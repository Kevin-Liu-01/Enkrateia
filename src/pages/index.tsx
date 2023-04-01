import { type NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useState,
  useEffect,
  type SetStateAction,
  type FormEvent,
} from "react";
// import { api } from "~/utils/api";
import {
  UserCircleIcon,
  ServerIcon,
  DocumentIcon,
  AnnotationIcon,
} from "@heroicons/react/outline";
import { env } from "../env.mjs";
import Navbar from "./components/navbar";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: env.NEXT_PUBLIC_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const history: string[][] = [];

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [pattern, setPattern] = useState("cross");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [temp, setTemp] = useState("0.7");
  const [tokens, setTokens] = useState("256");
  const [freq, setFreq] = useState("0");

  //OpenAI integration
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [response, setResponse] = useState("");
  const [submit, setSubmit] = useState(false);

  //request openai from api endpoint
  console.log(history);
  useEffect(() => {
    async function fetchData() {
      if (submit) {
        history.push([session?.user?.name || "You", message]);
        const completion = await openai.createChatCompletion({
          model: model,
          messages: [{ role: "user", content: message }],
          temperature: parseInt(temp),
          max_tokens: parseInt(tokens),
          top_p: 1,
          frequency_penalty: parseInt(freq),
          presence_penalty: 0,
        });
        setResponse(completion?.data?.choices[0]?.message?.content || "");
        history.push([
          model,
          completion?.data?.choices[0]?.message?.content || "",
        ]);
      }
    }
    void fetchData();
    setSubmit(false);
  }, [submit]);

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
      "z-5  absolute h-[100vh] w-[100vw] pattern-gray-500 dark:pattern-gray-500 pattern-bg-gray-300 dark:pattern-bg-gray-800 pattern-opacity-20 pattern-size-8";
    if (pattern === "cross") {
      return defaultPattern + " pattern-cross";
    } else if (pattern === "dots") {
      return defaultPattern + " pattern-dots";
    } else {
      return defaultPattern + " pattern-paper";
    }
  };

  const handleQuery = (text: string) => {
    setQuery(text);
    setMessage(text);
  };

  const handleTempChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTemp(event.target.value);
  };

  const handleTokenChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTokens(event.target.value);
  };

  const handleFreqChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFreq(event.target.value);
  };

  const setSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmit(!submit);
    setQuery("");
  };

  return (
    <>
      <Navbar pattern={pattern} patternBG={patternBG} />
      <main className="overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 font-general dark:from-gray-800 dark:to-gray-900 ">
        <div className="relative z-10  grid min-h-[calc(100vh-4rem)] grid-cols-1 sm:grid-cols-12">
          <div className="col-span-3 border-r border-r-gray-600 p-4 font-[300] dark:border-r-gray-600">
            <div className="text-3xl font-[600]">Get Started</div> <br />
            <p className="">
              Enter an instruction or select a preset, and watch the API respond
              with a completion that attempts to match the context or pattern
              you provided.
            </p>
            <br />
            <p className="">
              You can control which model completes your request by changing the
              model.
            </p>
            <br />
            <div className="font-sm mb-3 text-sm font-[600] text-gpt">
              KEEP IN MIND
            </div>
            <div className="ml-3 mb-3 flex flex-row text-sm">
              <ServerIcon className="h-12 w-12" />
              <div className="ml-4">
                Use good judgement when writing inputs. This API is not free, so
                results are forced to be reduced to {"<1000 tokens."}
              </div>
            </div>
            <div className="ml-3 mb-3 flex flex-row text-sm">
              <DocumentIcon className="h-12 w-12" />
              <div className="ml-4">
                Not all responses may be ideally formatted. The API does not
                support markdown and as such, responses will be pure text.
              </div>
            </div>
            <div className="ml-3 mb-3 flex flex-row text-sm">
              <AnnotationIcon className="h-12 w-12" />
              <div className="ml-4">
                GPT-4 takes significantly longer to generate a response than
                gpt-3.5-turbo. If you want to try out GPT-4, responses may take
                longer than expected.
              </div>
            </div>
          </div>
          <div className="col-span-7 flex h-[100%] flex-col ">
            <div className={patternStyles()}></div>
            <div className="relative z-10 flex h-[100%] flex-col justify-between ">
              <div className="h-[100%] border-r border-r-gray-600 p-4 dark:border-r-gray-600">
                <p className="mb-2 select-none font-semibold text-gray-500 dark:text-white">
                  CHATGPT:
                </p>
                <div className="flex items-center">
                  {session?.user.image ? (
                    <Image
                      src={(session && session.user.image) || ""}
                      alt="avatar"
                      className="mr-4 h-10 w-10 rounded-full"
                      height={500}
                      width={500}
                    />
                  ) : (
                    <UserCircleIcon className="mr-2 inline h-10 w-10 rounded-full text-gray-800 dark:text-gray-400 sm:mb-1" />
                  )}
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {session && "Signed in as "}
                    {session ? session.user.name : "Guest"}
                  </p>
                </div>
                <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-700">
                  <div className="flex items-center">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                      className="mb-0.5 mr-2 inline h-6 w-6 sm:mb-0 sm:mt-0.5"
                      alt="ChatGPT"
                      height={500}
                      width={500}
                    />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {model}:
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {response}
                  </p>
                </div>
                <div className="scrollbar my-4 flex grow flex-col overflow-y-scroll rounded-lg bg-white p-4 dark:bg-gray-700">
                  <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Chat History
                  </p>

                  <div className="flex flex-col">
                    {history.map((msg, i) => (
                      <div key={i} className="mb-2 flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {msg[0]}
                        </span>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {msg[1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-t-gray-600 bg-white p-4 dark:border-t-gray-600 dark:bg-gray-800">
                <form
                  onSubmit={(e) => setSubmission(e)}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 focus:outline-none  focus:ring-2 focus:ring-gpt dark:border-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    value={query}
                    onChange={(e) => handleQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-4 flex items-center rounded-lg bg-gptLight py-2 pl-2 pr-4 text-white duration-150 ease-in-out hover:bg-gpt dark:bg-gpt dark:hover:bg-gptDark"
                  >
                    <Image
                      src="https://cdn.cdnlogo.com/logos/c/38/ChatGPT.svg"
                      className=" inline h-4 w-4 sm:mr-1"
                      height={500}
                      width={500}
                      alt="ChatGPT"
                    />
                    <div className="hidden text-base text-gray-900 sm:inline">
                      Send
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="dark:bg-gray-800font-general relative z-10 col-span-2 bg-white p-4 dark:bg-gray-800 dark:text-white md:text-lg">
            <div className=" inline-block text-left text-black">
              <div className="dark:text-white"> Model</div>
              <select
                onChange={handleModels}
                className="focus:shadow-outline relative block w-full appearance-none rounded-xl border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option>gpt-3.5-turbo</option>
                <option>gpt-4</option>
                {/* <option>text-davinci-003</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="my-auto h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.95 7.95l-3.54 3.54-3.54-3.54-1.41 1.41 3.54 3.54-3.54 3.54 1.41 1.41 3.54-3.54 3.54 3.54 1.41-1.41-3.54-3.54 3.54-3.54z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="">Temperature</div>
              <div className="ml-auto pr-4">{temp}</div>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={temp}
              onChange={(e) => handleTempChange(e)}
              className="slider w-full"
            />
            <div className="flex flex-row ">
              <div className="">Max Tokens</div>
              <div className="ml-auto pr-4">{tokens}</div>
            </div>

            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={tokens}
              onChange={(e) => handleTokenChange(e)}
              className="slider w-full"
            />

            <div className="flex flex-row ">
              <div className="">Frequency Penalty</div>
              <div className="ml-auto pr-4">{freq}</div>
            </div>

            <input
              type="range"
              min="0"
              max="1.0"
              step="0.1"
              value={freq}
              onChange={(e) => handleFreqChange(e)}
              className="slider w-full"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
