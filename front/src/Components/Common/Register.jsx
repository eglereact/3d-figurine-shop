import { useEffect, useState } from "react";
import useServerPost from "../../Hooks/useServerPost";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import useRegister from "../../Validations/useRegister";
import Header from "../Web/Header";
import Gate from "./Gate";
import Redirect from "./Redirect";
import Footer from "../Web/Footer";

const Register = () => {
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    password2: "",
  };

  const [form, setForm] = useState(defaultValues);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { doAction, response } = useServerPost(l.SERVER_REGISTER);
  const { errors, validate, setServerErrors } = useRegister();

  useEffect(() => {
    if (null === response) {
      return;
    }
    setButtonDisabled(false);
    if (response.type === "success") {
      window.location.hash = l.REDIRECT_AFTER_REGISTER;
    } else {
      if (response.data?.response?.data?.errors) {
        setServerErrors(response.data.response.data.errors);
      }
    }
  }, [response]);

  const handleForm = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    //validations
    if (!validate(form)) {
      return;
    }
    setButtonDisabled(true);
    doAction({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <>
      <Gate status="not-logged">
        <Header />
        <div className="bg-white flex items-center justify-center p-6">
          <div className="max-width  flex flex-col md:flex-row text-grey">
            <section className="bg-pink w-full lg:w-1/3 p-10 xl:px-20 rounded-lg flex-1 flex flex-col justify-center mt-6">
              <div className="text-center">
                <h1 className="text-5xl text-light font-light mb-4">
                  Create Your Account
                </h1>
                <h3 className="text-sm mb-10">
                  View your order history, address book, and more.
                </h3>
              </div>
              <form className="space-y-4">
                <Input
                  label="NAME"
                  type="text"
                  name="name"
                  onChange={handleForm}
                  value={form.name}
                  placeholder="Jon Doe"
                  autoComplete="username"
                  errors={errors}
                />

                <Input
                  label="EMAIL"
                  type="email"
                  name="email"
                  onChange={handleForm}
                  value={form.email}
                  placeholder="jondoe@example.com"
                  autoComplete="email"
                  errors={errors}
                />

                <Input
                  label="PASSWORD"
                  type="password"
                  name="password"
                  onChange={handleForm}
                  value={form.password}
                  placeholder="**********"
                  autoComplete="new-password"
                  errors={errors}
                />

                <Input
                  label="REPEAT PASSWORD"
                  type="password"
                  name="password2"
                  onChange={handleForm}
                  value={form.password2}
                  placeholder="**********"
                  autoComplete="new-password"
                  errors={errors}
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="button-dark active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
                    type="button"
                    disabled={buttonDisabled}
                  >
                    create account
                  </button>
                </div>
                <div className="flex gap-1 text-grey border-t-2 border-white justify-center w-full flex-col">
                  <h2 className="uppercase p-4 mt-6 text-lg text-center">
                    Already have an account?
                  </h2>
                  <p className="flex justify-center">
                    <a
                      href={l.SITE_LOGIN}
                      className="active:scale-75 transition-transform bg-transparent text-grey  w-[215px] py-4 border-[0.5px] border-[#3A3A3E]  cursor-pointer uppercase px-10 rounded button-empty-animation"
                    >
                      login
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
export default Register;
