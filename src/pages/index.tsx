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
  AnnotationIcon,
  ArrowNarrowRightIcon,
  ClockIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { env } from "../env.mjs";
import Typewriter from "typewriter-effect";
import Navbar from "./components/navbar";
import { Configuration, OpenAIApi } from "openai";

// type Roles = "user" | "assistant" | "system";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [pattern, setPattern] = useState("cross");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [temp, setTemp] = useState("0");
  const [tokens, setTokens] = useState("256");
  const [freq, setFreq] = useState("0");
  const [top_p, setTop_P] = useState("1");
  const [translate, setTranslate] = useState(false);
  const [debug, setDebug] = useState(false);
  const [memory, setMemory] = useState(true);
  const [apiKey, setAPIKEY] = useState("");

  const [history, setHistory] = useState([] as string[][]);
  const [font, setFont] = useState("font-general");

  //OpenAI integration
  const [model, setModel] = useState("gpt-3.5-turbo");
  // const [roles, setRoles] = useState<Roles>("user");
  const [submit, setSubmit] = useState(false);

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);
  //request openai from api endpoint
  useEffect(() => {
    async function fetchData() {
      if (submit && apiKey) {
        const context =
          history.length >= 2 && memory
            ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              "The context for this conversation is as follows:" +
              "\nMy first Prompt:" +
              history.slice(-2)?.[0]?.[1] +
              "\n Your first Response:" +
              history.slice(-2)?.[1]?.[1] +
              "\n My new prompt:" +
              message +
              "\n Your new response:"
            : message;
        history.push([session?.user?.name || "Guest", message]);
        const completion = await openai.createChatCompletion({
          model: model,
          messages: [{ role: "user", content: context }],
          temperature: parseInt(temp),
          max_tokens: parseInt(tokens),
          top_p: parseInt(top_p),
          frequency_penalty: parseInt(freq),
          presence_penalty: 0,
        });

        setHistory(
          // Replace the state
          [
            // with a new array
            ...history, // that contains all the old items
            [
              model,
              completion?.data?.choices[0]?.message?.content || "",
              temp,
              tokens,
              top_p,
              freq,
              memory.toString(),
            ], // and one new item at the end
          ]
        );
      }
    }
    void fetchData();
    setSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit]);

  const handleModels = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setModel(event.target.value);
  };

  // const handleRoles = (event: { target: { value: Roles } }) => {
  //   setRoles(event.target.value);
  // };

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
      "z-5 absolute h-[100vh] w-[100vw] pattern-gray-500 dark:pattern-gray-500 pattern-bg-gray-300 dark:pattern-bg-gray-900 pattern-opacity-20 pattern-size-8 duration-150";
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
  const handlePChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTop_P(event.target.value);
  };

  const setSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmit(!submit);
    setQuery("");
  };

  const chatSelector = (msg: string) => {
    if (msg == session?.user?.name) {
      return (
        <Image
          src={(session && session.user.image) || ""}
          alt="avatar"
          className="mr-4 h-8 w-8 rounded-full"
          height={500}
          width={500}
        />
      );
    } else if (msg == "Guest") {
      return (
        <UserCircleIcon className="mr-2 inline h-8 w-8 rounded-full text-gray-800 dark:text-gray-400 sm:mb-1" />
      );
    } else {
      return (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
          className="mb-0.5 mr-2 inline h-8 w-8 sm:mb-0 sm:mt-0.5"
          alt="ChatGPT"
          height={500}
          width={500}
        />
      );
    }
  };

  const menuHandler = () => {
    setTranslate(!translate);
  };

  const fontInitializer = () => {
    if (font === "font-general") {
      setFont("font-satoshi");
    } else if (font === "font-satoshi") {
      setFont("font-azeret");
    } else if (font === "font-azeret") {
      setFont("font-clash");
    } else {
      setFont("font-general");
    }
  };

  return (
    <main className={font}>
      <Navbar
        pattern={pattern}
        patternBG={patternBG}
        menuHandler={menuHandler}
        fontInitializer={fontInitializer}
      />
      <div className="overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 duration-150 dark:from-gray-800 dark:to-gray-900 ">
        <div
          className={
            translate
              ? "relative z-10 grid min-h-[calc(100vh-4.05rem)] grid-cols-1 lg:grid-cols-9"
              : "relative z-10 grid min-h-[calc(100vh-4.05rem)] grid-cols-1 lg:grid-cols-12"
          }
        >
          <section
            className={
              translate
                ? "scrollbar absolute z-30 flex max-h-[calc(100vh-4.05rem)] min-h-[calc(100vh-4.05rem)] translate-x-[-100%] flex-col overflow-y-scroll border-r border-r-gray-600 bg-gray-50 p-4 pr-2 text-sm font-[300] duration-150 dark:border-r-gray-600 dark:bg-gray-800 lg:relative lg:hidden 2xl:text-base 2xl:font-[400]"
                : "scrollbar absolute z-30 flex max-h-[calc(100vh-4.05rem)] min-h-[calc(100vh-4.05rem)] translate-x-0 flex-col overflow-y-scroll border-r border-r-gray-600 bg-gray-50 p-4 pr-2 text-sm font-[300] duration-150 dark:border-r-gray-600 dark:bg-gray-800 lg:relative lg:col-span-3 2xl:text-base 2xl:font-[400]"
            }
          >
            <button
              className="absolute top-0 right-0 mt-[1.125rem] mr-2"
              onClick={() => setTranslate(!translate)}
            >
              <XIcon className=" h-6 w-6" />
            </button>
            <h1 className="xs:text-4xl mb-4 mt-2 inline text-[2.2rem] font-extrabold tracking-tight duration-75 dark:text-white lg:hidden">
              <span className="">Enkrateia </span>
              <span className="text-gpt">GPT4</span>
            </h1>
            <div className="text-2xl font-[600] lg:text-2xl">Get Started</div>
            <br />
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
              <AnnotationIcon className="h-12 w-12" />
              <div className="ml-4">
                Not all responses may be ideally formatted. The API does not
                support markdown and as such, responses will be pure text.
              </div>
            </div>
            <div className="ml-3 mb-3 flex flex-row text-sm">
              <ClockIcon className="h-12 w-12" />
              <div className="ml-4">
                GPT-4 takes significantly longer to generate a response than
                gpt-3.5-turbo. If you want to try out GPT-4, responses may take
                longer than expected.
              </div>
            </div>
            <div className=" mt-auto rounded-lg border-[1.5px] border-gpt bg-white p-4 duration-150  dark:bg-gray-800">
              <div className="flex items-center ">
                <span className="mr-2 rounded bg-gptLighter px-2.5 py-0.5 text-sm font-semibold text-gptDark duration-150 dark:bg-gptLight dark:text-gptDarker">
                  Beta
                </span>
              </div>
              <p className="my-3 text-sm text-slate-900 duration-150 dark:text-slate-400">
                Welcome to Enkrateia! Enkrateia allows you to access the OpenAI
                APIs of the latest GPT-3 and GPT-4 models. You can generate text
                from a prompt or pattern, leveraging the cutting-edge
                capabilities of these advanced language models.
              </p>
              <a
                className="text-sm text-slate-900 underline duration-150 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                href="https://openai.com/about"
              >
                Learn about OpenAI and ChatGPT
                <ArrowNarrowRightIcon className="mb-1 inline h-4 w-4" />
              </a>
            </div>
          </section>
          <section className="col-span-7 flex max-h-[calc(100vh-4.05rem)] min-h-[calc(100vh-4.05rem)] flex-col ">
            <div className={patternStyles()}></div>
            <div className="relative z-10 flex h-[100%] flex-col justify-between ">
              <div className="h-[100%] border-r border-r-gray-600 duration-150 dark:border-r-gray-600">
                <div className="border-b border-b-gray-600 bg-gray-50 p-4 duration-150  dark:bg-gray-800">
                  <p className="mb-2 select-none text-2xl font-semibold text-gray-800 duration-150 dark:text-white">
                    GPT Sandbox
                  </p>
                  <div className="flex items-center">
                    {session?.user.image ? (
                      <Image
                        src={(session && session.user.image) || ""}
                        alt="avatar"
                        className="mr-4 h-10 w-10 rounded-full border-[1.5px] border-gray-900 text-gray-800 duration-150 dark:border-white dark:text-white"
                        height={500}
                        width={500}
                      />
                    ) : (
                      <UserCircleIcon className="relative my-auto mr-2 inline h-10 w-10 rounded-full border-[1.5px] border-gray-900 text-gray-800 duration-150 dark:border-white dark:text-white sm:mb-1" />
                    )}
                    <p className="text-lg  text-gray-800 duration-150 dark:text-gray-100">
                      {session && "Signed in as "}
                      {session ? session.user.name : "Guest"}
                    </p>
                    <button
                      className="ml-auto flex items-center rounded-xl bg-gptLight p-2 text-gray-900 duration-75 hover:bg-gpt dark:bg-gpt dark:text-white dark:hover:bg-gptDark"
                      onClick={() => setHistory([])}
                    >
                      <TrashIcon className="inline h-6 w-6 lg:mr-1" />

                      <span className="hidden lg:inline">
                        Clear Conversation
                      </span>
                    </button>
                  </div>
                </div>

                <div className="scrollbar flex h-[100%] max-h-[calc(100vh-15.72rem)] grow flex-col-reverse overflow-y-scroll rounded-xl p-4 shadow-inner">
                  <div className="flex flex-col">
                    {history.map((msg, i) => (
                      <div
                        key={i}
                        className="mb-3 flex flex-col rounded-lg bg-white p-4 duration-150  dark:bg-gray-700"
                      >
                        <div className="flex items-center">
                          {chatSelector(msg[0] || "")}
                          <p className="text-sm font-semibold text-gray-700 duration-150 dark:text-gray-200">
                            {msg[0]}:
                          </p>
                          <div className="ml-auto flex flex-row text-xs font-[400]">
                            {debug && msg[2] && (
                              <>
                                <span className="ml-2">Temp: {msg[2]}</span>
                                <span className="ml-2">Tokens: {msg[3]}</span>
                                <span className="ml-2">Top_P: {msg[4]}</span>
                                <span className="ml-2">
                                  Frequency: {msg[5]}
                                </span>
                                <span className="ml-2">
                                  Memorized: {msg[6]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {msg[0] == "gpt-3.5-turbo" || msg[0] == "gpt-4" ? (
                            <Typewriter
                              options={{
                                loop: false,
                                delay: 20,
                                cursor: "",
                                autoStart: true,
                              }}
                              onInit={(typewriter) =>
                                typewriter.typeString(msg[1] || "").start()
                              }
                            />
                          ) : (
                            msg[1]
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-t-gray-600 bg-gray-50 p-4 duration-150 dark:border-t-gray-600  dark:bg-gray-800">
                <form
                  onSubmit={(e) => setSubmission(e)}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full rounded-lg border  border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 duration-150 focus:outline-none  focus:ring-2 focus:ring-gpt dark:border-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    value={query}
                    onChange={(e) => handleQuery(e.target.value)}
                  />
                  {apiKey ? (
                    <button
                      type="submit"
                      className="ml-4 flex items-center  rounded-lg bg-gptLight py-2 px-2 text-white duration-150 ease-in-out hover:bg-gpt dark:bg-gpt dark:hover:bg-gptDark lg:px-0 lg:py-2 lg:pl-2 lg:pr-4"
                    >
                      <Image
                        src="https://cdn.cdnlogo.com/logos/c/38/ChatGPT.svg"
                        className=" inline h-6 w-6 lg:mr-1"
                        height={500}
                        width={500}
                        alt="ChatGPT"
                      />
                      <div className="hidden text-base text-gray-900 sm:inline">
                        Send
                      </div>
                    </button>
                  ) : (
                    <button className="ml-4 flex items-center rounded-lg bg-gptLight py-2 px-2 text-white opacity-50 duration-150 ease-in-out  dark:bg-gpt lg:px-0 lg:py-2 lg:pl-2 lg:pr-4">
                      <Image
                        src="https://cdn.cdnlogo.com/logos/c/38/ChatGPT.svg"
                        className=" inline h-6 w-6 lg:mr-1"
                        height={500}
                        width={500}
                        alt="ChatGPT"
                      />
                      <div className="hidden text-base text-gray-900 sm:inline">
                        Send
                      </div>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </section>
          <section className="scrollbar relative z-10 col-span-2 flex max-h-[calc(100vh-4.05rem)] flex-col gap-4 overflow-y-scroll bg-gray-50 p-4 duration-150 dark:bg-gray-800 dark:text-white md:text-lg  lg:min-h-[calc(100vh-4.05rem)]">
            <p className="select-none text-2xl font-semibold text-gray-800 duration-150 dark:text-white">
              Parameters
            </p>
            <div>
              <div className="duration-150 dark:text-white">
                {" "}
                Enter your API Key
              </div>
              <input
                onChange={(e) => setAPIKEY(e.target.value)}
                className="focus:shadow-outline relative block w-full appearance-none rounded-lg border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow duration-150 hover:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="API Key"
                value={apiKey}
                maxLength={51}
              />
            </div>
            <div>
              <div className="duration-150 dark:text-white"> Model</div>
              <select
                onChange={(e) => handleModels(e)}
                className="focus:shadow-outline relative block w-full appearance-none rounded-lg border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow duration-150 hover:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option>gpt-3.5-turbo</option>

                <option>gpt-4</option>
              </select>
            </div>
            {/* <div>
              <div className=" dark:text-white"> Role</div>
              <select
                onChange={(e:Roles) => handleRoles(e)}
                className="focus:shadow-outline relative block w-full appearance-none rounded-lg border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option>user</option>
                <option>assistant</option>
                <option>system</option>
              </select>
            </div> */}
            <div>
              <div className="flex flex-row ">
                <div className="">Temperature</div>
                <div className="ml-auto pr-4">{temp}</div>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                Controls the level of creativity in responses.
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={temp}
                onChange={(e) => handleTempChange(e)}
                className="slider w-full accent-gptDark duration-150 dark:accent-gptLight"
              />
            </div>
            <div>
              <div className="flex flex-row ">
                <div className="">Max Tokens</div>
                <div className="ml-auto pr-4">{tokens}</div>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                1 token ≈ 4 characters in English
              </p>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={tokens}
                onChange={(e) => handleTokenChange(e)}
                className="slider w-full accent-gptDark duration-150 dark:accent-gptLight"
              />
            </div>
            <div>
              <div className="flex flex-row ">
                <div className="">Frequency Penalty</div>
                <div className="ml-auto pr-4">{freq}</div>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                Controls the level of repetition in responses.
              </p>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={freq}
                onChange={(e) => handleFreqChange(e)}
                className="slider w-full accent-gptDark duration-150 dark:accent-gptLight"
              />
            </div>

            <div>
              <div className="flex flex-row ">
                <div className="">Top P</div>
                <div className="ml-auto pr-4">{top_p}</div>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                Controls the randomness of the response.
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={top_p}
                onChange={(e) => handlePChange(e)}
                className="slider w-full accent-gptDark duration-150 dark:accent-gptLight"
              />
            </div>
            <div>
              <div className="flex flex-row ">
                <div className="">Memorize Conversation</div>
                <input
                  type="checkbox"
                  onChange={() => setMemory(!memory)}
                  checked={memory}
                  className="ml-auto mt-1 h-6 w-6 accent-gptDark duration-150 dark:accent-gptLight"
                />
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                ChatGPT will continue your conversations.
              </p>
            </div>

            <div>
              <div className="flex flex-row ">
                <div className="">Show Parameters</div>
                <input
                  type="checkbox"
                  onChange={() => setDebug(!debug)}
                  className="ml-auto mt-1 h-6 w-6 accent-gptDark duration-150 dark:accent-gptLight"
                />
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400">
                Show what values were sent to the API.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
