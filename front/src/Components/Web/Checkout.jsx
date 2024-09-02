import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Contexts/Cart";
import Header from "./Header";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import { AuthContext } from "../../Contexts/Auth";
import useServerPost from "../../Hooks/useServerPost";
import { LoaderContext } from "../../Contexts/Loader";

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

  const { doAction, response } = useServerPost(l.STORE_CART);

  const { user } = useContext(AuthContext);
  // const { errors, validateForm, setServerErrors } = useCreatePost();
  const { setShow } = useContext(LoaderContext);

  useEffect(() => {
    if (response === null) return;

    setButtonDisabled(false);
    if (response.type === "success") {
      window.location.hash = l.SITE_HOME;
    }
    // Uncomment and handle server errors if necessary
    else {
      // if (response.data?.response?.data?.errors) {
      //   setServerErrors(response.data.response.data.errors);
      // }
    }
  }, [response]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  if (!checkoutDetails) {
    return (
      <p>No checkout details available. Please go back to the cart page.</p>
    );
  }

  const { cart, shipping, subtotal, tax, total } = checkoutDetails;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here if necessary
    // if (!validateForm(form, image)) return;
    setShow(true);
    setButtonDisabled(true);
    doAction({
      ...form,
      user_id: user.id,
      cart: cart,
      total: total,
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
          <div className="w-1/2 bg-pink p-6 rounded-lg">
            <form className="space-y-4 ">
              <Input
                label="NAME"
                type="text"
                name="name"
                onChange={handleChange}
                value={user.name}
                placeholder="Jon Doe"
                autoComplete="username"
                // errors={errors}
              />

              <Input
                label="SURNAME"
                type="text"
                name="surname"
                onChange={handleChange}
                value={form.surname}
                placeholder="jondoe@example.com"
                autoComplete="email"
                // errors={errors}
              />

              <Input
                label="EMAIL"
                type="email"
                name="email"
                onChange={handleChange}
                value={user.email}
                placeholder="jondoe@example.com"
                autoComplete="email"
                // errors={errors}
              />
              <Input
                label="ADDRESS"
                type="text"
                name="address"
                onChange={handleChange}
                value={form.address}
                placeholder="Fake str.15 Fake City"
                autoComplete="email"
                // errors={errors}
              />
              <Input
                label="PHONE"
                type="text"
                name="phone"
                onChange={handleChange}
                value={form.phone}
                placeholder="+370 123 45 678"
                autoComplete="email"
                // errors={errors}
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="button-dark active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                  type="button"
                  disabled={buttonDisabled}
                >
                  place your order
                </button>
              </div>
            </form>
          </div>
          <div className="bg-pink p-6 rounded-lg w-1/2">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Checkout;
