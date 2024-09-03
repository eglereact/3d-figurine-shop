import { useContext, useEffect, useState } from "react";
import { RouterContext } from "../../Contexts/Router";
import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import Header from "./Header";
import StarRating from "./StarRating";
import { GoDotFill } from "react-icons/go";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CartContext } from "../../Contexts/Cart";
import { MdOutlineDiscount } from "react-icons/md";
import ProductPrice from "./ProductPrice";

const Product = () => {
  const { params } = useContext(RouterContext);
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.GET_PRODUCT
  );

  const [product, setProduct] = useState(null);

  console.log(product);

  const [count, setCount] = useState(1);
  const { addToCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const handleIncrease = () => {
    setCount((prev) => Math.min(prev + 1, product.in_stock));
  };

  const handleDecrease = () => {
    setCount((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    addToCart(product, count);
    setCount(1); // Reset count to 1 after adding to cart if desired
  };

  useEffect(() => {
    doGet("/" + params[0]);
  }, [doGet, params]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }

    setProduct(serverGetResponse.data.product ?? null);
  }, [serverGetResponse]);

  return (
    <>
      <Header />
      <section className="max-width p-6">
        {product === null ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex sm:flex-row w-full">
            <div className="w-full sm:w-1/2 bg-sand p-6 rounded-lg shadow-inner">
              {" "}
              {product.photo === null ? (
                <img
                  src={l.SERVER_IMAGES_URL + "no-image.png"}
                  alt="no photo"
                />
              ) : (
                <img
                  src={l.SERVER_IMAGES_URL + product.photo}
                  alt={product.title}
                />
              )}
            </div>
            <div className="w-full sm:w-1/2 lg:pr-20">
              <div className="flex justify-between">
                {product.discount ? (
                  <p className="uppercase text-white bg-brown h-6 text-sm flex gap-1  items-center px-4 rounded">
                    <MdOutlineDiscount /> on sale
                  </p>
                ) : (
                  <p></p>
                )}
                <div className="flex flex-col items-end justify-center">
                  <StarRating rating={product.rating} />
                  <span className="text-xs uppercase mr-1">
                    {product.rating > 0 ? "1" : "0"} Review
                  </span>
                </div>
              </div>
              <div className="text-grey flex flex-col gap-3 mt-6">
                <h1 className="text-3xl uppercase">{product.title}</h1>
                <ProductPrice
                  price={product.price}
                  discount={product.discount}
                  productPage={true}
                />
                <span className="text-xs uppercase mr-1">
                  Tax included. Shipping calculated at checkout.
                </span>
              </div>
              <div className="uppercase flex w-full text-sm h-8 mt-20">
                <div className="bg-[#2D7B6C] w-2/5 rounded-l flex items-center justify-center text-white">
                  <span className="flex justify-center items-center">
                    <GoDotFill /> In Stock
                  </span>
                </div>
                <div className="bg-pink w-3/5 flex items-center justify-center ">
                  <span>Free 30 day returns</span>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-4 my-3">
                <div className="flex w-40 py-2 text-grey items-center gap-4 border-[0.5px] border-[#3A3A3E] rounded justify-center">
                  <button
                    className="nav-icons-animation text-xl"
                    onClick={handleDecrease}
                  >
                    <FiMinus />
                  </button>
                  <p className="text-lg">{count}</p>
                  <button
                    className="nav-icons-animation text-xl"
                    onClick={handleIncrease}
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="uppercase button-empty-animation w-full py-4 text-grey text-center border-[0.5px] border-[#3A3A3E] rounded"
                >
                  Add to cart
                </button>
              </div>

              <button className="w-full active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation">
                Buy it now
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default Product;
