import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import useServerDelete from "../../Hooks/useServerDelete";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalsContext } from "../../Contexts/Modals";
import Gate from "../Common/Gate";
import { LoaderContext } from "../../Contexts/Loader";

const ProductsList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_PRODUCTS
  );
  //   const { doAction: doDelete, serverResponse: serverDeleteResponse } =
  //     useServerDelete(l.SERVER_DELETE_POST);
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

  //   useEffect(() => {
  //     if (null === serverDeleteResponse) {
  //       return;
  //     }
  //     if (serverDeleteResponse.type === "error") {
  //       showPost();
  //     } else {
  //       removeHidden();
  //     }
  //   }, [serverDeleteResponse, showPost, removeHidden]);

  return (
    <>
      <Gate status="role" role={["admin", "editor"]}>
        <h1 className="text-5xl mb-4">Products List</h1>
        <h2 className="text-2xl mb-10">
          Currently products {products?.length}
        </h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            <tbody>
              {products === null && (
                <tr>
                  <td>Loading...</td>
                </tr>
              )}
              {products !== null &&
                products.map((product) => (
                  <tr
                    key={product?.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td>
                      {product?.photo === null ? (
                        <img
                          style={{ height: "120px", width: "auto" }}
                          src={l.SERVER_IMAGES_URL + "no-image.png"}
                          alt="nėra nuotraukos"
                        />
                      ) : (
                        <img
                          style={{ height: "120px", width: "auto" }}
                          src={l.SERVER_IMAGES_URL + product.photo}
                          alt={product.title}
                        />
                      )}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {product?.title}
                    </th>
                    <td className="px-6 py-4">{product?.price}</td>
                    <td className="px-6 py-4">{product?.info}</td>
                    <td className="px-6 py-4">{product?.featured}</td>
                    <td className="px-6 py-4">{product?.approved}</td>
                    <td className="px-6 py-4">{product?.rating}</td>
                    <td className="px-6 py-4">{product?.discount}</td>
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
                    <td className="px-6 py-4 flex gap-5">
                      <a
                        href={l.USER_EDIT + "/" + product.id}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        // onClick={() =>
                        //   setDeleteModal({
                        //     data: user,
                        //     doDelete,
                        //     hideData: hideUser,
                        //   })
                        // }
                        className="inline-flex items-center text-sm rounded-lg border border-transparent font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50 disabled:pointer-events-none"
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
