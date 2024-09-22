import { useContext, useEffect, useState } from "react";
import * as l from "../../Constants/urls";
import useServerPost from "../../Hooks/useServerPost";
import { LoaderContext } from "../../Contexts/Loader";
import { AuthContext } from "../../Contexts/Auth";
import Header from "../Web/Header";
import Input from "../Forms/Input";
import Gate from "./Gate";
import Redirect from "./Redirect";
import useLogin from "../../Validations/useLogin";
import Footer from "../Web/Footer";

const Login = () => {
  const defaultValues = { email: "", password: "" };

  const [form, setForm] = useState(defaultValues);

  const { doAction, response } = useServerPost(l.SERVER_LOGIN);
  const { errors, validate, setServerErrors } = useLogin();

  const { setShow } = useContext(LoaderContext);

  const { addUser, removeUser } = useContext(AuthContext);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setServerErrors(newErrors);
    }
  };

  useEffect(() => {
    if (null === response) {
      return;
    }
    if (response.type === "success") {
      addUser(response.data.user);
      if (
        response.data.user.role === "admin" ||
        response.data.user.role === "editor"
      ) {
        window.location.href = l.SITE_DASHBOARD;
      } else {
        window.location.href = l.SITE_HOME;
      }
    } else {
      removeUser();
    }
  }, [response]);

  const submit = () => {
    if (!validate(form)) {
      return;
    }
    setShow(true);
    doAction(form);
  };

  return (
    <>
      <Gate status="not-logged">
        <Header />
        <div className="bg-white flex items-center justify-center p-6">
          <div className="max-width flex flex-col md:flex-row text-grey">
            <section className="bg-pink w-full lg:w-1/3 p-10 xl:px-20 rounded-lg flex-1 flex flex-col justify-center mt-6">
              <div className="text-center">
                <h1 className="text-5xl text-light font-light mb-4">
                  Login to Your Account
                </h1>
                <h3 className="text-sm mb-10">
                  View your order history, address book, and more.
                </h3>
              </div>
              <form className="space-y-4">
                <div className="flex flex-col">
                  <Input
                    type="email"
                    name="email"
                    placeholder="jondoe@example.com"
                    autoComplete="email"
                    className="bg-light-grey rounded outline-none p-2"
                    onChange={handleForm}
                    value={form.email}
                    label="EMAIL"
                    errors={errors}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    type="password"
                    name="password"
                    placeholder="**********"
                    autoComplete="new-password"
                    className="bg-light-grey rounded outline-none p-2"
                    onChange={handleForm}
                    value={form.password}
                    label="PASSWORD"
                    errors={errors}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                    type="button"
                    onClick={submit}
                  >
                    login
                  </button>
                </div>
                <div className="flex gap-1 text-grey border-t-2 border-white justify-center w-full flex-col">
                  <h2 className="uppercase p-4 mt-6 text-lg text-center">
                    New to Our Shop?
                  </h2>
                  <p className="flex justify-center">
                    <a
                      href={l.SITE_REGISTER}
                      className="active:scale-75 transition-transform bg-transparent text-grey  w-[215px] py-4 border-[0.5px] border-[#3A3A3E]  cursor-pointer uppercase px-10 rounded button-empty-animation"
                    >
                      Create account
                    </a>
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </Gate>
      <Gate status="logged">
        <Redirect to="SITE_HOME" />
      </Gate>
      <Footer />
    </>
  );
};

export default Login;
