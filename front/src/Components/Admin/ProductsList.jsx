import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import useServerDelete from "../../Hooks/useServerDelete";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalsContext } from "../../Contexts/Modals";
import Gate from "../Common/Gate";
import { LoaderContext } from "../../Contexts/Loader";
import { FaCheck, FaTimes } from "react-icons/fa";
import StarRating from "../Web/StarRating";
import Loading from "../Common/Loading";

const ProductsList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_PRODUCTS
  );
  const { doAction: doDelete, serverResponse: serverDeleteResponse } =
    useServerDelete(l.SERVER_DELETE_PRODUCT);
  //   const { doAction: doPut, serverResponse: serverPutResponse } = useServerPut(
  //     l.SERVER_CHANGE_POST_TOP
  //   );

  const { setDeleteModal } = useContext(ModalsContext);
  const [products, setProducts] = useState(null);
  //   const { setShow } = useContext(LoaderContext);

  const hideProduct = (product) => {
    setProducts((p) =>
      p.map((p) => (p.id === product.id ? { ...p, hidden: true } : p))
    );
  };

  const showProduct = useCallback(() => {
    setProducts((p) =>
      p.map((p) => {
        delete p.hidden;
        return p;
      })
    );
  }, []);

  const removeHidden = useCallback((_) => {
    setProducts((p) => p.filter((p) => !p.hidden));
  }, []);

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setProducts(serverGetResponse.data.products ?? null);
  }, [serverGetResponse]);

  useEffect(() => {
    if (null === serverDeleteResponse) {
      return;
    }
    if (serverDeleteResponse.type === "error") {
      showProduct();
    } else {
      removeHidden();
    }
  }, [serverDeleteResponse, showProduct, removeHidden]);

  return (
    <>
      <Gate status="role" role={["admin", "editor"]}>
        <div className="text-grey flex flex-col gap-2 mb-6 uppercase">
          <h1 className="text-4xl">Products List</h1>
          <h2 className="text-xl">
            Currently products{" "}
            <span className="font-bold">{products?.length}</span>
          </h2>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <table className="w-full text-sm text-center rtl:text-right text-grey">
            <thead className="text-xs text-white uppercase bg-grey">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Photo
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Info
                </th>
                <th scope="col" className="px-6 py-3">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3">
                  Approved
                </th>
                <th scope="col" className="px-6 py-3">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated At
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {products === null && (
                <tr>
                  <td>
                    <Loading />
                  </td>
                </tr>
              )}
              {products !== null &&
                products.map((product) => (
                  <tr key={product?.id} className="odd:bg-white  even:bg-pink">
                    <td>
                      {product?.photo === null ? (
                        <img
                          src={l.SERVER_IMAGES_URL + "no-image.png"}
                          alt="nėra nuotraukos"
                        />
                      ) : (
                        <img
                          className="w-48 p-1 bg-sand rounded m-4"
                          src={l.SERVER_IMAGES_URL + product.photo}
                          alt={product.title}
                        />
                      )}
                    </td>
                    <th scope="row" className="px-6 py-4">
                      {product?.title}
                    </th>
                    <td className="px-6 py-4">€{product?.price}</td>
                    <td className="px-6 py-4">{product?.info}</td>
                    <td className="px-6 py-4">
                      {product.featured ? <FaCheck /> : <FaTimes />}
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      {product.approved ? <FaCheck /> : <FaTimes />}
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={product?.rating} size={4} />
                    </td>
                    <td className="px-6 py-4">{product?.discount}%</td>
                    <td className="px-6 py-4">
                      {
                        new Date(product?.created_at)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td className="px-6 py-4">
                      {
                        new Date(product?.updated_at)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td className="px-6 py-4 flex flex-col mt-4 gap-2">
                      <a
                        href={l.PRODUCT_EDIT + "/" + product.id}
                        className="bg-grey text-white py-2 px-4 rounded button-animation"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            data: product,
                            doDelete,
                            hideData: hideProduct,
                          })
                        }
                        className="bg-grey text-white py-2 px-4 rounded button-animation"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Gate>
    </>
  );
};
export default ProductsList;
