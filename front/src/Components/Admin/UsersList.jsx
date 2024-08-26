import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import useServerDelete from "../../Hooks/useServerDelete";
import { useCallback, useContext, useEffect, useState } from "react";

const UsersList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_USERS
  );
  const { doAction: doDelete, serverResponse: serverDeleteResponse } =
    useServerDelete(l.SERVER_DELETE_USER);
  //   const { setDeleteModal } = useContext(ModalsContext);
  const [users, setUsers] = useState(null);

  const hideUser = (user) => {
    setUsers((u) =>
      u.map((u) => (u.id === user.id ? { ...u, hidden: true } : u))
    );
  };

  const showUser = useCallback(() => {
    setUsers((u) =>
      u.map((u) => {
        delete u.hidden;
        return u;
      })
    );
  }, []);

  const removeHidden = useCallback(() => {
    setUsers((u) => u.filter((u) => !u.hidden));
  }, []);

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setUsers(serverGetResponse.data.users ?? null);
  }, [serverGetResponse]);

  useEffect(() => {
    if (null === serverDeleteResponse) {
      return;
    }
    if (serverDeleteResponse.type === "error") {
      showUser();
    } else {
      removeHidden();
    }
  }, [serverDeleteResponse, showUser, removeHidden]);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users === null && (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
            {users !== null &&
              users.map((user) => (
                <tr
                  key={user?.id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user?.name}
                  </th>
                  <td className="px-6 py-4">{user?.email}</td>
                  <td className="px-6 py-4">{user?.role}</td>
                  <td className="px-6 py-4">
                    {new Date(user?.created_at).toISOString().split("T")[0]}
                  </td>
                  <td className="px-6 py-4 flex gap-5">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersList;
