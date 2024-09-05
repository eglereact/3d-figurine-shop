import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import useServerDelete from "../../Hooks/useServerDelete";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalsContext } from "../../Contexts/Modals";
import Gate from "../Common/Gate";
import Redirect from "../Common/Redirect";

const UsersList = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_USERS
  );
  const { doAction: doDelete, serverResponse: serverDeleteResponse } =
    useServerDelete(l.SERVER_DELETE_USER);
  const { setDeleteModal } = useContext(ModalsContext);
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
    <>
      <Gate status="role" role={["admin"]}>
        <div className="text-grey flex flex-col gap-2 mb-6 uppercase">
          <h1 className="text-4xl">Users List</h1>
          <h2 className="text-xl">
            Currently users
            <span className="font-bold"> {users?.length}</span>
          </h2>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-center rtl:text-right text-grey">
            <thead className="text-xs text-white uppercase bg-grey">
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
                    className="odd:bg-white even:bg-pink text-grey"
                  >
                    <td scope="row" className="px-6 py-4 capitalize">
                      {user?.name}
                    </td>
                    <td className="px-6 py-4">{user?.email}</td>
                    <td className="px-6 py-4">{user?.role}</td>
                    <td className="px-6 py-4">
                      {new Date(user?.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <a
                        href={l.USER_EDIT + "/" + user.id}
                        className="bg-grey text-white py-2 px-4 rounded button-animation w-20"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            data: user,
                            doDelete,
                            hideData: hideUser,
                          })
                        }
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
      <Gate status="role" role={["editor"]}>
        <Redirect to="SITE_DASHBOARD" />
      </Gate>
    </>
  );
};
export default UsersList;
