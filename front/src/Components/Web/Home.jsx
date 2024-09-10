import Carousel from "./Carousel";
import FAQ from "./FAQ";
import FeaturingProducsLP from "./FeaturingProducsLP";
import Footer from "./Footer";
import Header from "./Header";
import MapLP from "./MapLP";
import ShippingLP from "./ShippingLP";
import TimerCountDown from "./TimerCountDown";

const Home = () => {
  return (
    <>
      <Header />
      <Carousel />
      <FeaturingProducsLP />
      <TimerCountDown />
      <FAQ />
      <MapLP />
      <ShippingLP />
      <Footer />
    </>
  );
};
export default Home;
