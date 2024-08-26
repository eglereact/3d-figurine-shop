import { useContext, useEffect } from "react";
import { AuthContext } from "../../Contexts/Auth";
import * as l from "../../Constants/urls";
import useServerPost from "../../Hooks/useServerPost";
import { LoaderContext } from "../../Contexts/Loader";

export default function Logout() {
  const { user, removeUser } = useContext(AuthContext);

  const { doAction, response } = useServerPost(l.SERVER_LOGOUT);

  const { setShow } = useContext(LoaderContext);

  useEffect(() => {
    if (null === response) {
      return;
    }
    if (response.type === "success") {
      removeUser();
      window.location.href = l.SITE_LOGIN;
    }
  }, [response, removeUser]);

  return (
    <button
      className="bg-gray-200 py-2"
      type="button"
      onClick={() => doAction() || setShow(true)}
    >
      Logout
    </button>
  );
}
