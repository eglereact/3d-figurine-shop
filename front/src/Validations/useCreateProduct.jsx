import { useState } from "react";

const useCreateProduct = () => {
  const [errors, setErrors] = useState({});

  const setServerErrors = (err) => {
    setErrors(err);
  };

  const validateForm = (form, image) => {
    const errorsBag = {};

    // Validate title
    if (form.title.length < 3) {
      errorsBag.title = "Title is too short. Min length is 3 symbols.";
    }

    // Validate text
    if (form.info.length < 10) {
      errorsBag.info = "Text is too short. Min length is 10 symbols.";
    }

    // Validate price
    if (isNaN(form.price)) {
      errorsBag.price = "Amount must be a number.";
    } else if (Number(form.price) < 1) {
      errorsBag.price = "Min amount 1.";
    }
    // Validate in stock
    if (isNaN(form.in_stock)) {
      errorsBag.in_stock = "Must be a number.";
    } else if (Number(form.in_stock) < 1) {
      errorsBag.in_stock = "Min amount 1.";
    }

    // Validate image
    if (!image) {
      errorsBag.photo = "Please select an image.";
    }

    if (Object.keys(errorsBag).length === 0) {
      setErrors({});
      return true;
    }

    setErrors(errorsBag);
    return false;
  };

  return { errors, validateForm, setServerErrors };
};

export default useCreateProduct;
