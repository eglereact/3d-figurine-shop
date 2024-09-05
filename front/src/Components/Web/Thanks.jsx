import Header from "./Header";
import * as l from "../../Constants/urls";
import Footer from "./Footer";

const Thanks = () => {
  return (
    <>
      <Header />
      <div className="flex items-center flex-col mt-10 gap-6">
        <h1 className="  text-4xl text-grey">Thank You for Your Order!</h1>
        <a
          href={l.SITE_PRODUCTS}
          className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
        >
          shop again
        </a>
      </div>
      <Footer />
    </>
  );
};
export default Thanks;
