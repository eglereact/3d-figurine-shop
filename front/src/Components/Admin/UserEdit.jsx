import { useContext, useEffect, useState } from "react";
import { RouterContext } from "../../Contexts/Router";
import useServerGet from "../../Hooks/useServerGet";
import useServerPut from "../../Hooks/useServerPut";
import * as l from "../../Constants/urls";
import roles from "../../Constants/roles";
import Input from "../Forms/Input";
import Select from "../Forms/Select";
import { LoaderContext } from "../../Contexts/Loader";
import Loading from "../Common/Loading";
import useEditUser from "../../Validations/useEditUser";

export default function UserEdit() {
  const { params } = useContext(RouterContext);
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_EDIT_USER
  );
  const { doAction: doPut, serverResponse: serverPutResponse } = useServerPut(
    l.SERVER_UPDATE_USER
  );

  const { setShow } = useContext(LoaderContext);
  const [user, setUser] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { errors, validate } = useEditUser();

  useEffect(() => {
    doGet("/" + params[1]);
  }, [doGet, params]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setButtonDisabled(false);
    setUser(serverGetResponse.data.user ?? null);
  }, [serverGetResponse]);

  useEffect(() => {
    if (null === serverPutResponse) {
      return;
    }
    if ("success" === serverPutResponse.type) {
      window.location.href = l.USERS_LIST;
    }
  }, [serverPutResponse]);

  const handleForm = (e) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const submit = () => {
    if (!validate(user)) {
      return;
    }
    setShow(true);
    setButtonDisabled(true);
    doPut(user);
  };

  return (
    <>
      <h1 className="text-4xl mb-10 text-grey">User Edit</h1>
      <section>
        {null === user && <Loading />}
        {null !== user && (
          <form className="flex flex-col gap-6">
            <Input
              onChange={handleForm}
              value={user.name}
              type="text"
              name="name"
              label="NAME"
              errors={errors}
            />
            <Input
              onChange={handleForm}
              value={user.email}
              type="text"
              name="email"
              autoComplete="off"
              label="EMAIL"
              errors={errors}
            />
            <Input
              onChange={handleForm}
              value={user.password}
              type="password"
              name="password"
              placeholder="Change password"
              autoComplete="new-password"
              label="PASSWORD"
            />
            <Select
              onChange={handleForm}
              value={user.role}
              name="role"
              options={roles}
              label="SELECT ROLE"
            />
            <ul className="flex items-center gap-4 mt-6">
              <li>
                <button
                  onClick={submit}
                  type="button"
                  className="grey-button"
                  disabled={buttonDisabled}
                >
                  Save
                </button>
              </li>
              <li>
                <a className="grey-button" href={"/" + l.USERS_LIST}>
                  cancel
                </a>
              </li>
            </ul>
          </form>
        )}
      </section>
    </>
  );
}
