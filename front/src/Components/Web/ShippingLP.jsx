import { MdOutlineLocalShipping, MdOutlineSupportAgent } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

const ShippingLP = () => {
  return (
    <>
      <div className="box  -mb-10 border-b">
        <div className="flex justify-center items-center pt-44 pb-20 max-width">
          <div className="flex sm:flex-row px-6 flex-col justify-between w-full items-center gap-10 text-white">
            <div className="flex flex-col items-center text-center gap-2">
              <MdOutlineLocalShipping size={50} />
              <h2 className="uppercase text-2xl">Fast Shipping</h2>
              <p className="text-sm">
                All orders ship within 24 hours with express two-day shipping.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <BsBoxSeam size={50} />
              <h2 className="uppercase text-2xl">Fast Shipping</h2>
              <p className="text-sm">
                All orders ship within 24 hours with express two-day shipping.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <MdOutlineSupportAgent size={50} />
              <h2 className="uppercase text-2xl">Fast Shipping</h2>
              <p className="text-sm">
                All orders ship within 24 hours with express two-day shipping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingLP;
