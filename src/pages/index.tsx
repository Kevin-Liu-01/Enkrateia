import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { TrashIcon } from "@heroicons/react/outline";
import Navbar from "~/components/navbar";
import { env } from "~/env.mjs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: env.NEXT_PUBLIC_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const Home: NextPage = () => {
  const { data: session } = useSession();

  const [query, setQuery] = useState("");

  //OpenAI integration
  const [response, setResponse] = useState("");
  const [submit, setSubmit] = useState(false);

  //request openai from api endpoint

  useEffect(() => {
    console.log("hui");
    async function fetchData() {
      if (submit) {
        const completion = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [{ role: "user", content: query }],
          temperature: 0,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
        });
        setResponse(completion.data.choices[0].message.content);
      }
    }
    fetchData();
    setSubmit(false);
  }, [submit]);

  const handleMessageChange = (event: {
    target: { value: boolean | ((prevState: boolean) => boolean) };
  }) => {
    // 👇️ access textarea value
    setQuery(event.target.value);
  };

  const handleReset = () => {
    setQuery("");
    setResponse("");
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />

        <title>Enkrateia</title>
        <meta
          name="description"
          content="Enkrateia allows you to access the power of humanity's sum knowledge."
        />
        <meta content="./favicon.png" property="og:image" />
        <link rel="apple-touch-icon" href="./favicon.ico" />
        {/*
            manifest.json provides metadata used when your web app is installed on a
            user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
        */}
        <link rel="manifest" href="./manifest.json" />
        {/*
            Notice the use of %PUBLIC_URL% in the tags above.
            It will be replaced with the URL of the `public` folder during the build.
            Only files inside the `public` folder can be referenced from the HTML.
            Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
            work correctly both with client-side routing and a non-root public URL.
            Learn how to configure a non-root public URL by running `npm run build`.
        */}

        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@701,200,500,301,201,300,601,600,401,501,400,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="mx-auto flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 font-general dark:from-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="z-5 pattern-cross absolute h-[100vh] w-[100vw] pattern-bg-white pattern-blue-500 pattern-opacity-20 pattern-size-8"></div>
        <div className="relative z-10 flex min-h-screen max-w-7xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="z-10 ml-4 mr-4 flex h-full w-full grow flex-col rounded-2xl bg-gray-50 shadow-lg lg:rounded-3xl">
            <div className="p-4">
              <p className="select-none font-semibold text-gray-400">
                CHATGPT:
              </p>{" "}
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
                        GPT-4:
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
