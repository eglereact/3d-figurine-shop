import { useState } from "react";

const useCheckout = () => {
  const [errors, setErrors] = useState({});

  const setServerErrors = (err) => {
    setErrors(err);
  };

  const validate = (form) => {
    const errorsBag = {};
    if (form.name.length < 3) {
      errorsBag.name = "Name is too short. Min length is 3 symbols.";
    }

    if (form.surname.length < 3) {
      errorsBag.surname = "Surname is too short. Min length is 3 symbols.";
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
