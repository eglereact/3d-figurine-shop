import useServerGet from "../../Hooks/useServerGet";
import Header from "./Header";
import * as l from "../../Constants/urls";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Footer from "./Footer";

const Sale = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_SALE_PRODUCTS
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
      <Footer />
    </>
  );
};
export default Sale;
