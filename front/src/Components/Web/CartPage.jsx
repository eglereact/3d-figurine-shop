import { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { CartContext } from "../../Contexts/Cart";
import * as l from "../../Constants/urls";
import { FiMinus, FiPlus } from "react-icons/fi";
import Gate from "../Common/Gate";

const CartPage = () => {
  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateShipping,
    prepareCheckout,
    shipping,
  } = useContext(CartContext);

  const [cartDetails, setCartDetails] = useState({
    subtotal: 0,
    shipping: 5,
    total: 0,
  });

  const tax = 2; // Example tax rate (10%)

  // Calculate Subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate Total
  const total = subtotal + tax + shipping;

  const handleProceedToCheckout = () => {
    prepareCheckout(); // Prepare checkout details
    // Navigate to the CheckoutPage
    window.location.href = l.SITE_CHECKOUT;
  };

  useEffect(() => {
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
  }, [cartDetails]);

  return (
    <>
      <Header />
      <section className="max-width p-6 ">
        <div className="text-grey border-b-[1px] border-gray-200 pb-4 flex justify-between">
          <h1 className="text-3xl uppercase ">
            Cart{" "}
            <span className="text-lg">
              {cart.length}
              {cart.length === 1 ? " item" : " items"}
            </span>
          </h1>
          <button
            onClick={() => clearCart()}
            className="uppercase p-2 text-center border-[0.5px] border-[#3A3A3E] mb-2 rounded button-empty-animation "
          >
            clear cart
          </button>
        </div>

        {cart.length < 1 ? (
          <div className="flex items-center flex-col mt-10 gap-6">
            <h1 className="  text-4xl text-grey">Your cart is empty</h1>
            <a
              href={l.SITE_PRODUCTS}
              className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
            >
              fill it
            </a>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 my-6 w-2/3">
              {cart.map((item) => (
                <div className="border-b-[1px] border-gray-200 pb-6 flex gap-6 text-grey">
                  <img
                    className="w-40 bg-sand p-2 rounded-lg"
                    src={l.SERVER_IMAGES_URL + item.photo}
                    alt={item.title}
                  />
                  <div className="flex justify-between w-full">
                    <h2 className="uppercase">{item.title}</h2>
                    <div>
                      <p className="text-2xl">
                        ${(item.price.toFixed(2) * item.quantity).toFixed(2)}
                      </p>
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
                      <button
                        className="uppercase text-xs hover:underline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-1/3 flex-col gap-6 text-grey">
              <div className="bg-pink mt-6 h-64 rounded-lg">
                <div className="bg-pink mt-6 p-6 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <select
                      className="bg-transparent p-1 cursor-pointer rounded"
                      value={shipping}
                      onChange={(e) => updateShipping(Number(e.target.value))}
                    >
                      <option value={5}>Standard Shipping - $5.00</option>
                      <option value={15}>Express Shipping - $15.00</option>
                    </select>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Gate status="logged">
                <button
                  className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                  type="button"
                  onClick={() => {
                    setCartDetails({
                      subtotal: subtotal.toFixed(2),
                      shipping: shipping,
                      total: total.toFixed(2),
                    });
                    handleProceedToCheckout();
                  }}
                >
                  proceed to checkout
                </button>
              </Gate>
              <Gate status="not-logged">
                <a
                  className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                  type="button"
                  href={l.SITE_LOGIN}
                >
                  login
                </a>
              </Gate>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default CartPage;
