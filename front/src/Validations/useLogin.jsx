import { useState } from "react";

const useLogin = () => {
  const [errors, setErrors] = useState({});

  const setServerErrors = (err) => {
    setErrors(err);
  };

  const validate = (form) => {
    const errorsBag = {};

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      errorsBag.email = "Email is not valid.";
    }

    if (form.password.length < 3) {
      errorsBag.password = "Password is required.";
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
export default useLogin;
