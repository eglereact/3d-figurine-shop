import React, { useContext, useEffect, useState } from "react";
import * as l from "../../Constants/urls";
import useServerGet from "../../Hooks/useServerGet";
import StarRating from "./StarRating";
import { MdOutlineDiscount } from "react-icons/md";
import { IoSparklesSharp } from "react-icons/io5";
import ProductPrice from "./ProductPrice";
import { GoDotFill } from "react-icons/go";
import { CartContext } from "../../Contexts/Cart";

const FeaturingProducsLP = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_FEATURED_PRODUCTS
  );

  const [products, setProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (serverGetResponse?.data?.products && !products) {
      setProducts(serverGetResponse.data.products);
      setSelectedProduct(serverGetResponse.data.products[0]); // Set default selected product
    }
  }, [serverGetResponse, products]);

  // Handle when the user clicks on a product's image or button
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  if (!products) return <div>Loading...</div>;

  return (
    <section className="max-width my-40 flex justify-center">
      <div className="flex relative justify-center items-center rounded-lg">
        {/* List of product cards */}
        <div className="absolute flex flex-col gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-sand  rounded-lg"
              onClick={() => handleProductSelect(product)}
            >
              <img
                src={`${l.SERVER_IMAGES_URL}/${product.photo}`}
                alt={product.title}
                className="w-20 cursor-pointer shadow-md rounded-lg"
                onClick={() => handleProductSelect(product)} // Clicking image selects product
              />
            </div>
          ))}
        </div>

        {/* Selected product details */}
        <div className="">
          {selectedProduct && (
            <div className="flex w-full">
              <div className="w-1/2">
                <img
                  src={`${l.SERVER_IMAGES_URL}/${selectedProduct.photo}`}
                  alt={selectedProduct.title}
                  className="bg-sand p-10 rounded-l-lg"
                />
              </div>
              <div className="w-1/2 bg-grey rounded-r-lg p-10 pl-20">
                <div className="flex justify-between">
                  {selectedProduct.discount ? (
                    <div className="flex gap-2">
                      <p className="uppercase text-white bg-brown h-6 text-sm flex gap-1  items-center px-4 rounded">
                        <MdOutlineDiscount /> on sale
                      </p>
                      <p className="uppercase text-white bg-brown h-6 text-sm flex gap-1  items-center px-4 rounded">
                        <IoSparklesSharp /> featured
                      </p>
                    </div>
                  ) : (
                    <p className="uppercase text-white bg-brown h-6 text-sm flex gap-1  items-center px-4 rounded">
                      <IoSparklesSharp /> featured
                    </p>
                  )}
                  <div className="flex flex-col items-end justify-center">
                    <StarRating
                      rating={selectedProduct.rating}
                      size={6}
                      dark={true}
                    />
                    <span className="text-xs uppercase mr-1 text-white">
                      {selectedProduct.rating > 0 ? "1" : "0"} Review
                    </span>
                  </div>
                </div>
                <div className="text-grey flex flex-col gap-3 mt-20">
                  <h1 className="text-3xl uppercase text-white">
                    {selectedProduct.title}
                  </h1>
                  <ProductPrice
                    price={selectedProduct.price}
                    discount={selectedProduct.discount}
                    landingPage={true}
                  />
                  <span className="text-xs uppercase mr-1 text-white">
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
                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="uppercase button-empty-animation w-full py-4 text-white text-center border-[0.5px] border-white mt-6 rounded"
                >
                  Add to cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturingProducsLP;
