import React, { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../../Contexts/Cart";
import Header from "./Header";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import { AuthContext } from "../../Contexts/Auth";
import useServerPost from "../../Hooks/useServerPost";
import { LoaderContext } from "../../Contexts/Loader";
import useCheckout from "../../Validations/useChechout";
import Footer from "./Footer";
import dropin from "braintree-web-drop-in";
import useServerGet from "../../Hooks/useServerGet";

const Checkout = () => {
  const defaultValues = {
    name: "",
    surname: "",
    email: "",
    address: "",
    phone: "",
    user_id: "",
    cart: [],
    total: "",
    payment_nonce: "",
  };

  const { checkoutDetails } = useContext(CartContext);
  const [form, setForm] = useState(defaultValues);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { clearCart, cart } = useContext(CartContext);
  const { doAction, response } = useServerPost(l.STORE_CART);
  const { user } = useContext(AuthContext);
  const { errors, validate, setServerErrors } = useCheckout();
  const { setShow } = useContext(LoaderContext);
  const [cartDetails, setCartDetails] = useState({
    subtotal: 0,
    shipping: 5,
    total: 0,
  });
  const [paymentNonce, setPaymentNonce] = useState(null);
  const [dropinInstance, setDropinInstance] = useState(null);
  const dropinContainerRef = useRef(null);
  const { doAction: doGet, response: serverGetResponse } =
    useServerGet("clienttoken");
  const [clientToken, setClientToken] = useState(null);
  const { doAction: doPost, response: serverPostResponse } =
    useServerPost("checkout");

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (serverGetResponse) {
      setClientToken(serverGetResponse.data.data ?? null);
    }
  }, [serverGetResponse]);

  useEffect(() => {
    if (clientToken) {
      dropin.create(
        {
          authorization: clientToken,
          container: dropinContainerRef.current,
        },
        (err, instance) => {
          if (err) {
            console.error("Drop-in creation error:", err);
            return;
          }
          setDropinInstance(instance);
        }
      );
    }

    // return () => {
    //   if (dropinInstance && typeof dropinInstance.teardown === "function") {
    //     dropinInstance
    //       .teardown()
    //       .catch((err) => console.error("Teardown error:", err));
    //   }
    // };
  }, [clientToken, dropinInstance]);

  useEffect(() => {
    if (response === null) return;
    setButtonDisabled(false);
    if (response.type === "success") {
      clearCart();
      window.location.hash = l.THANKS_FOR_ORDER;
    } else {
      if (response.data?.response?.data?.errors) {
        setServerErrors(response.data.response.data.errors);
      }
    }
  }, [response]);

  useEffect(() => {
    if (serverPostResponse) {
      setButtonDisabled(false);
      if (serverPostResponse.type === "success") {
        console.log("Payment successful");
      } else {
        if (serverPostResponse.data?.response?.data?.errors) {
          setServerErrors(serverPostResponse.data.response.data.errors);
        }
      }
    }
  }, [serverPostResponse]);

  useEffect(() => {
    const storedCartDetails = localStorage.getItem("cartDetails");
    if (storedCartDetails) {
      setCartDetails(JSON.parse(storedCartDetails));
    }
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handlePayment = (callback) => {
    if (!dropinInstance) return;

    dropinInstance.requestPaymentMethod((err, payload) => {
      if (err) {
        console.error("Payment method error:", err);
        return;
      }

      const paymentData = {
        paymentMethodNonce: payload.nonce,
        amount: cartDetails.total, // Ensure this is correctly set
      };

      // No .then() here, just call the doPost function
      doPost(paymentData);

      // Pass the nonce to the callback after initiating the payment
      setPaymentNonce(payload.nonce);
      callback(payload.nonce); // Pass the nonce to handleSubmit
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(form)) return;

    setShow(true);

    setButtonDisabled(true);

    handlePayment((nonce) => {
      const formData = {
        ...form,
        user_id: user.id,
        cart: cart,
        total: cartDetails.total,
        payment_nonce: nonce,
      };

      doAction(formData);
    });
  };

  return (
    <>
      <Header />
      <section className="max-width p-6">
        <div className="text-grey border-b-[1px] border-gray-200 pb-4">
          <h1 className="text-3xl uppercase">Checkout</h1>
        </div>

        <div className="flex gap-6 my-6 w-full">
          <div className="bg-pink p-6 rounded-lg w-full">
            <h1 className="pb-4 text-xl uppercase text-grey">
              Shipping Information
            </h1>
            <form onSubmit={handleSubmit} className="flex w-full gap-10">
              <div className="flex flex-col gap-6 w-1/2">
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="NAME"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                    placeholder="Jon Doe"
                    autoComplete="username"
                    errors={errors}
                  />
                  <Input
                    label="SURNAME"
                    type="text"
                    name="surname"
                    onChange={handleChange}
                    value={form.surname}
                    placeholder="Doe"
                    autoComplete="surname"
                    errors={errors}
                  />
                </div>
                <Input
                  label="EMAIL"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  placeholder="jondoe@example.com"
                  autoComplete="email"
                  errors={errors}
                />
                <Input
                  label="ADDRESS"
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={form.address}
                  placeholder="Fake str.15 Fake City"
                  autoComplete="address"
                  errors={errors}
                />
                <Input
                  label="PHONE"
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  value={form.phone}
                  placeholder="+370 123 45 678"
                  autoComplete="phone"
                  errors={errors}
                />
                <div ref={dropinContainerRef} id="dropin-container"></div>
              </div>

              <div className="bg-pink p-6 pt-0 rounded-lg text-grey w-1/2">
                <div className="flex flex-col gap-2 mb-6">
                  {cart.map((c, i) => (
                    <div
                      className="flex gap-4 bg-white rounded p-2 text-grey"
                      key={i}
                    >
                      <img
                        src={l.SERVER_IMAGES_URL + c.photo}
                        alt={c.title}
                        className="w-28 bg-sand rounded p-2"
                      />
                      <div>
                        <span>{c.title}</span>
                        <p>${c.price}</p>
                        <p>quantity: {c.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${cartDetails.subtotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${cartDetails.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                  <span>Total</span>
                  <span>${cartDetails.total}</span>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="button-dark active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                    disabled={buttonDisabled}
                  >
                    Place Your Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Checkout;
