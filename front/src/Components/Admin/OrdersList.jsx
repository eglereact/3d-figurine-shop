import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import { useEffect, useState, useRef } from "react";
import Gate from "../Common/Gate";
import useServerPut from "../../Hooks/useServerPut";
import { IoMdMore } from "react-icons/io";
import Loading from "../Common/Loading";

const OrdersList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_ORDERS
  );

  const { doAction: doPut, response: serverPutResponse } = useServerPut(
    l.SERVER_CHANGE_ORDER_STATUS
  );

  const [orders, setOrders] = useState(null);
  const oldOrderId = useRef(null);

  // Fetch orders on component mount
  useEffect(() => {
    doGet();
  }, [doGet]);

  // Update local state with fetched orders
  useEffect(() => {
    if (serverGetResponse) {
      setOrders(serverGetResponse.data.orders ?? null);
    }
  }, [serverGetResponse]);

  // Handle server response for status updates
  useEffect(() => {
    if (serverPutResponse) {
      if (serverPutResponse.message?.type === "error") {
        // Revert status change in case of an error
        setOrders((orders) =>
          orders.map((order) =>
            order.id === oldOrderId.current
              ? { ...order, status: oldOrderId.currentStatus } // Use previous status
              : order
          )
        );
      } else {
        // Update the order list with the new status
        setOrders((orders) =>
          orders.map((order) =>
            order.id === serverPutResponse.newId
              ? { ...order, status: serverPutResponse.newStatus }
              : order
          )
        );
      }
    }
  }, [serverPutResponse]);

  // Function to handle status change
  const handleStatusChange = (orderId, newStatus) => {
    const order = orders.find((order) => order.id === orderId);
    oldOrderId.current = orderId;
    oldOrderId.currentStatus = order.status; // Store the old status
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    doPut({ id: orderId, status: newStatus });
  };

  return (
    <>
      <Gate status="role" role={["admin", "editor"]}>
        <div className="text-grey flex flex-col gap-2 mb-6 uppercase">
          <h1 className="text-4xl">Orders List</h1>
          <h2 className="text-xl">
            Currently orders
            <span className="font-bold"> {orders?.length}</span>
          </h2>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-center rtl:text-right text-grey">
            <thead className="text-xs text-white uppercase bg-grey">
              <tr>
                {/* Table Headers */}
                <th scope="col" className="px-4 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-4 py-3">
                  User ID
                </th>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Surname
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Address
                </th>
                <th scope="col" className="px-4 py-3">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3">
                  Total
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Orders
                </th>
                <th scope="col" className="px-4 py-3">
                  Created At
                </th>
                <th scope="col" className="px-4 py-3">
                  Updated At
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders === null && (
                <tr>
                  <td>
                    <Loading />
                  </td>
                </tr>
              )}
              {orders !== null &&
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="odd:bg-white even:bg-pink text-grey"
                  >
                    <td>{order.order_id}</td>
                    <td scope="row" className="px-4 py-4">
                      {order.user_id}
                    </td>
                    <td className="px-4 py-4 capitalize">{order.name}</td>
                    <td className="px-4 py-4 capitalize">{order.surname}</td>
                    <td className="px-4 py-4">{order.email}</td>
                    <td className="px-4 py-4">{order.address}</td>
                    <td className="px-4 py-4">{order.phone}</td>
                    <td className="px-4 py-4">€{order.total}</td>
                    <td className="px-4 py-4">
                      {/* Status dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-grey text-white p-1 rounded"
                      >
                        <option value="waiting for approval">
                          Waiting for approval
                        </option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 flex justify-center items-center mt-4">
                      {JSON.parse(order.cart).length}{" "}
                      <button>
                        <IoMdMore size={25} />
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {new Date(order.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(order.updated_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-4 py-4 mt-4">
                      <button
                        type="button"
                        className="bg-grey text-white py-2 px-4 rounded button-animation w-20"
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

export default OrdersList;
