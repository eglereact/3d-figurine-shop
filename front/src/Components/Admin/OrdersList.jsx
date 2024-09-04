import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import { useEffect, useState, useRef } from "react";
import Gate from "../Common/Gate";
import useServerPut from "../../Hooks/useServerPut";

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
        <h1 className="text-5xl mb-4">Orders List</h1>
        <h2 className="text-2xl mb-10">Currently orders {orders?.length}</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {/* Table Headers */}
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Surname
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Orders
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
              {orders === null && (
                <tr>
                  <td colSpan="13">Loading...</td>
                </tr>
              )}
              {orders !== null &&
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td>{order.order_id}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {order.user_id}
                    </th>
                    <td className="px-6 py-4">{order.name}</td>
                    <td className="px-6 py-4">{order.surname}</td>
                    <td className="px-6 py-4">{order.email}</td>
                    <td className="px-6 py-4">{order.address}</td>
                    <td className="px-6 py-4">{order.phone}</td>
                    <td className="px-6 py-4">{order.total}</td>
                    <td className="px-6 py-4">
                      {/* Status dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="awaiting payment">
                          Awaiting Payment
                        </option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{order.cart.substring(0, 25)}</td>
                    <td className="px-6 py-4">
                      {new Date(order.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.updated_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 flex gap-5">
                      <button
                        type="button"
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

export default OrdersList;
