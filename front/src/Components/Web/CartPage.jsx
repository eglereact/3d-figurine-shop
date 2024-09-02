import { useContext, useState } from "react";
import Header from "./Header";
import { CartContext } from "../../Contexts/Cart";
import * as l from "../../Constants/urls";
import { FiMinus, FiPlus } from "react-icons/fi";

const CartPage = () => {
  const { cart, clearCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  return (
    <>
      <Header />
      <section className="max-width p-6 ">
        <h1 className="text-3xl uppercase text-grey border-b-[1px] border-gray-200 pb-4">
          Cart{" "}
          <span className="text-lg">
            {cart.length}
            {cart.length === 1 ? " item" : " items"}
          </span>
        </h1>
        <div className="flex gap-6">
          <div className="flex flex-col gap-6 my-6 w-2/3">
            {cart.map((item) => (
              <div className="border-b-[1px] border-gray-200 pb-6 flex gap-6">
                <img
                  className="w-40 bg-sand p-2 rounded-lg"
                  src={l.SERVER_IMAGES_URL + item.photo}
                  alt={item.title}
                />
                <div className="flex justify-between w-full">
                  <h2 className="uppercase">{item.title}</h2>
                  <div>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="flex gap-4 my-3">
                      <div className="flex w-28 py-1 text-grey items-center gap-2 border-[0.5px] border-[#3A3A3E] rounded justify-center">
                        <button
                          className="nav-icons-animation text-xl"
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity === 1}
                        >
                          <FiMinus />
                        </button>
                        <p className="text-lg">{item.quantity}</p>
                        <button
                          className="nav-icons-animation text-xl"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/3 bg-pink mt-6 h-64">
            <button onClick={() => clearCart()}>clear cart</button>
          </div>
        </div>
      </section>
    </>
  );
};
export default CartPage;
