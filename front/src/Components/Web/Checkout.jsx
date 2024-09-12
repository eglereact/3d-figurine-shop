import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Contexts/Cart";
import Header from "./Header";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import { AuthContext } from "../../Contexts/Auth";
import useServerPost from "../../Hooks/useServerPost";
import { LoaderContext } from "../../Contexts/Loader";
import useCheckout from "../../Validations/useChechout";
import Footer from "./Footer";
import { CiCircleAlert } from "react-icons/ci";

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
  };
  const { checkoutDetails } = useContext(CartContext);
  const [form, setForm] = useState(defaultValues);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { clearCart, cart } = useContext(CartContext);

  const { doAction, response } = useServerPost(l.STORE_CART);

  const { user } = useContext(AuthContext);
  const { errors, validate, setServerErrors } = useCheckout();
  const { setShow } = useContext(LoaderContext);

  const [cardDetails, setCardDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [cartDetails, setCartDetails] = useState({
    subtotal: 0,
    shipping: 5,
    total: 0,
  });

  console.log(cart);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedCartDetails = localStorage.getItem("cartDetails");

    // Check if data exists and parse it
    if (storedCartDetails) {
      const parsedDetails = JSON.parse(storedCartDetails);
      setCartDetails(parsedDetails);
    }
  }, []);

  // useEffect(() => {
  //   setForm((f) => ({
  //     ...f,
  //     name: user.name || "",
  //     email: user.email || "",
  //     user_id: user.id || "",
  //   }));
  // }, [user]);

  useEffect(() => {
    if (response === null) return;
    setButtonDisabled(false);
    if (response.type === "success") {
      clearCart();
      window.location.hash = l.THANKS_FOR_ORDER;
    }
    // Uncomment and handle server errors if necessary
    else {
      if (response.data?.response?.data?.errors) {
        setServerErrors(response.data.response.data.errors);
      }
    }
  }, [response]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here if necessary
    if (!validate(form, cardDetails)) return;
    setShow(true);
    setButtonDisabled(true);
    doAction({
      ...form,
      user_id: user.id,
      cart: cart,
      total: cartDetails.total,
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
              shipping information
            </h1>
            <form className="flex w-full gap-10">
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
                    placeholder="jondoe@example.com"
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

                <h2 className="text-2xl text-grey uppercase">
                  Credit Card Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-grey">
                    Cardholder's Name
                  </label>
                  <div className="relative bg-inherit">
                    <input
                      type="text"
                      value={cardDetails.cardName}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardName: e.target.value,
                        })
                      }
                      className={`
                       peer custom-autofill w-full bg-transparent h-10 rounded-lg text-grey placeholder-transparent ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
                      ${
                        errors.cardName
                          ? " ring-[#984B2C] shadow-sm"
                          : "bg-grey"
                      }
                      `}
                      placeholder="John Doe"
                      required
                    />
                    {errors.cardName && (
                      <span className="absolute inset-y-0 right-2 flex items-center text-[#984B2C]">
                        <CiCircleAlert size={30} />
                      </span>
                    )}
                  </div>
                  <div className="text-[#984B2C] text-sm">
                    <span className={errors.cardName ? "inline-block" : ""}>
                      {errors.cardName ?? ""}
                    </span>
                  </div>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-grey">
                    Card Number
                  </label>
                  <div className="relative bg-inherit">
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardNumber: e.target.value,
                        })
                      }
                      className={`
                      peer custom-autofill w-full bg-transparent h-10 rounded-lg text-grey placeholder-transparent ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
                      ${
                        errors.cardNumber
                          ? " ring-[#984B2C] shadow-sm"
                          : "bg-grey"
                      }
                      `}
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                      required
                    />
                    {errors.cardNumber && (
                      <span className="absolute inset-y-0 right-2 flex items-center text-[#984B2C]">
                        <CiCircleAlert size={30} />
                      </span>
                    )}
                  </div>
                  <div className="text-[#984B2C] text-sm">
                    <span className={errors.cardNumber ? "inline-block" : ""}>
                      {errors.cardNumber ?? ""}
                    </span>
                  </div>
                </div>

                {/* Expiration Date & CVC */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-grey">
                      Expiration Date
                    </label>
                    <div className="relative bg-inherit">
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiryDate: e.target.value,
                          })
                        }
                        className={`
                      peer custom-autofill w-full bg-transparent h-10 rounded-lg text-grey placeholder-transparent ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
                      ${
                        errors.expiryDate
                          ? " ring-[#984B2C] shadow-sm"
                          : "bg-grey"
                      }
                      `}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                      {errors.expiryDate && (
                        <span className="absolute inset-y-0 right-2 flex items-center text-[#984B2C]">
                          <CiCircleAlert size={30} />
                        </span>
                      )}
                    </div>
                    <div className="text-[#984B2C] text-sm">
                      <span className={errors.expiryDate ? "inline-block" : ""}>
                        {errors.expiryDate ?? ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-grey">
                      CVC
                    </label>
                    <div className="relative bg-inherit">
                      <input
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvc: e.target.value,
                          })
                        }
                        className={`
                      peer custom-autofill w-full bg-transparent h-10 rounded-lg text-grey placeholder-transparent ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
                      ${errors.cvc ? " ring-[#984B2C] shadow-sm" : "bg-grey"}
                      `}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                      {errors.cvc && (
                        <span className="absolute inset-y-0 right-2 flex items-center text-[#984B2C]">
                          <CiCircleAlert size={30} />
                        </span>
                      )}
                    </div>
                    <div className="text-[#984B2C] text-sm">
                      <span className={errors.cvc ? "inline-block" : ""}>
                        {errors.cvc ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
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
                        <p>quantity:{c.quantity}</p>
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
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>$2</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                  <span>Total</span>
                  <span>${cartDetails.total}</span>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSubmit}
                    className="button-dark active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                    type="button"
                    disabled={buttonDisabled}
                  >
                    place your order
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
