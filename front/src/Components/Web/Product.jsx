import { useContext, useEffect, useState } from "react";
import { RouterContext } from "../../Contexts/Router";
import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import Header from "./Header";
import StarRating from "./StarRating";

const Product = () => {
  const { params } = useContext(RouterContext);
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.GET_PRODUCT
  );
  const [product, setProduct] = useState(null);
  useEffect(() => {
    doGet("/" + params[0]);
  }, [doGet, params]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }

    setProduct(serverGetResponse.data.product ?? null);
  }, [serverGetResponse]);

  return (
    <>
      <Header />
      <section className="max-width p-6">
        {product === null ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex sm:flex-row w-full">
            <div className="w-full sm:w-1/2 bg-sand p-6 rounded-lg shadow-inner">
              {" "}
              {product.photo === null ? (
                <img
                  src={l.SERVER_IMAGES_URL + "no-image.png"}
                  alt="no photo"
                />
              ) : (
                <img
                  src={l.SERVER_IMAGES_URL + product.photo}
                  alt={product.title}
                />
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <p>{product.title}</p>
              <StarRating rating={product.rating} />
              <span className="text-xs uppercase">1 Review</span>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default Product;
