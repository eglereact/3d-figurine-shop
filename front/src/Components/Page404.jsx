import * as l from "../Constants/urls";

const Page404 = () => {
  return (
    <section className="flex h-screen justify-center items-center">
      <div className="flex flex-col justify-center text-center items-center bg-pink w-full m-6 lg:w-1/2 p-10 rounded-lg">
        <h1 className="text-grey text-5xl mb-6 font-semibold ">
          Lost in the Dungeon?
        </h1>
        <img src="images/404.png" className="w-80" />
        <p className=" text-grey py-6 text-lg">
          "Looks like you've ventured too deep into the unknown, adventurer!
          This page is as lost as a rogue in a maze."
        </p>
        <div className="flex md:flex-row flex-col gap-6">
          <a
            href={l.SITE_HOME}
            className="active:scale-75  transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
          >
            Return to the Marketplace
          </a>
          <a
            href={l.SITE_PRODUCTS}
            className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
          >
            Or start a new quest here!
          </a>
        </div>
      </div>
    </section>
  );
};
export default Page404;
