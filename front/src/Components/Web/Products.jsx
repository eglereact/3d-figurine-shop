import { useEffect, useState } from "react";
import Header from "./Header";
import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import ProductCard from "./ProductCard";

const Products = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_WEB_PRODUCTS
  );

  const [products, setProducts] = useState(null);

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setProducts(serverGetResponse.data.products ?? null);
  }, [serverGetResponse]);

  return (
    <>
      <Header />
      {products === null && (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
      <section className="max-width grid grid-cols-2 md:grid-cols-3 gap-6 p-6 gap-y-20">
        {products !== null &&
          products.map((p) => <ProductCard key={p.id} p={p} />)}
      </section>
    </>
  );
};
export default Products;
