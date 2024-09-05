import { useContext, useEffect, useState } from "react";
import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import { AuthContext } from "../../Contexts/Auth";

const UserCartList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_CART_BY_USER
  );
  const [userCartHistory, setUserCartHistory] = useState(null);
  const { user } = useContext(AuthContext);

  console.log(userCartHistory);

  console.log(user?.id);

  useEffect(() => {
    if (user?.id) {
      doGet("/" + user?.id);
    }
  }, [doGet, user]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setUserCartHistory(serverGetResponse.data.userCart ?? null);
  }, [serverGetResponse]);

  return (
    <section className="p-6 max-width">
      <h1 className="text-3xl uppercase text-grey pb-6">Cart History</h1>
      {userCartHistory === null ? (
        // While waiting for data (initially null)
        <p className="text-grey text-lg">Loading...</p>
      ) : userCartHistory.length === 0 ? (
        // When the cart history is an empty array
        <p className="text-grey text-lg">No cart history.</p>
      ) : (
        // When there is cart history
        <div className="flex flex-col gap-6">
          {userCartHistory.map((cartInfo) => (
            <div className="" key={cartInfo.order_id}>
              <div className="flex gap-6 text-grey">
                <h2 className=" mb-2">
                  {new Date(cartInfo?.created_at).toISOString().split("T")[0]}
                </h2>
                <p className="uppercase">
                  <span className=" pr-2">status:</span>
                  <span className="text-xs">{cartInfo.status}</span>
                </p>
                <p className="uppercase">
                  <span className=" pr-2">order id:</span>
                  <span className="text-xs">{cartInfo.order_id}</span>
                </p>
                <p className="uppercase">
                  <span className=" pr-2">total:</span>
                  <span className="text-xs">${cartInfo.total}</span>
                </p>
              </div>
              <div
                key={cartInfo.order_id}
                className="flex gap-2 p-2 rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              >
                {JSON.parse(cartInfo.cart).map((item, index) => (
                  <div key={index} className="w-20">
                    <img
                      src={l.SERVER_IMAGES_URL + item.photo}
                      alt={item.title}
                      className="bg-sand p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default UserCartList;
