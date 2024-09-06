import { useState } from "react";

const useCheckout = () => {
  const [errors, setErrors] = useState({});

  const setServerErrors = (err) => {
    setErrors(err);
  };

  const validate = (form, cardDetails) => {
    const errorsBag = {};

    // Form validations
    if (form.name.length < 3) {
      errorsBag.name = "Min length is 3 symbols.";
    }

    if (form.surname.length < 3) {
      errorsBag.surname = "Min length is 3 symbols.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      errorsBag.email = "Email is not valid.";
    }

    if (form.address.length < 10) {
      errorsBag.address = "Address is too short. Min length is 10 symbols.";
    }

    if (form.phone.length < 8) {
      errorsBag.phone = "Phone is too short. Min length is 8 symbols.";
    }

    // Card details validations
    if (cardDetails.cardName.length < 3) {
      errorsBag.cardName = "Cardholder's name is too short.";
    }

    if (!/^\d{16}$/.test(cardDetails.cardNumber)) {
      errorsBag.cardNumber = "Card number must be 16 digits.";
    }

    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      errorsBag.expiryDate = "Expiration date must be in MM/YY format.";
    }

    if (!/^\d{3}$/.test(cardDetails.cvc)) {
      errorsBag.cvc = "CVC must be 3 digits.";
    }

    if (Object.keys(errorsBag).length === 0) {
      setErrors({});
      return true;
    }
    setErrors(errorsBag);
    return false;
  };

  return { errors, validate, setServerErrors };
};
export default useCheckout;
