import Footer from "./Footer";
import Header from "./Header";
import ShippingLP from "./ShippingLP";

const Home = () => {
  return (
    <>
      <Header />
      <div className="max-width">
        <h1 className="text-5xl text-grey mt-10">Welcome to miniature shop!</h1>
      </div>
      <ShippingLP />
      <Footer />
    </>
  );
};
export default Home;
