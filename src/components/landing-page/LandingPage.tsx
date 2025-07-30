import FormGenerator from "../FormGenerator";

const LandingPage = () => {
  return (
    <section className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 pt-28 w-full bg-[url('/grid-black.svg')] dark:bg-[url('/grid-white.svg')] relative bg-opacity-5 z-0">
          <div
            className={`w-full absolute inset-0 bg-gradient-to-t from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-c from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <div
            className={`w-full absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-0 dark:to-zinc-950 to-white`}
          />
          <h1 className="z-10 text-4xl text-center font-semibold sm:text-5xl md:text-6xl tracking-tighter leading-6">
            Forms built to grow <br className="block sm:hidden" /> with you.
          </h1>
          <p className="z-10 mt-2 text-sm md:text-base max-w-2xl mx-auto text-center text-zinc-600 dark:text-zinc-300">
            Generate and share your form in seconds.{" "}
            <span className={"italic"}>
              Explore rich analytics, <br /> visual charts, and actionable
              insights.
            </span>
          </p>
          <div
            className={`w-full bg-gradient-to-b from-transparent z-0 dark:to-zinc-950 to-white h-24`}
          />
        </div>
        <FormGenerator chat={true} />
      </div>
    </section>
  );
};

export default LandingPage;
