import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";
import Logout from "../Common/Logout";
import * as l from "../../Constants/urls";
import Header from "./Header";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Header />
      <div className="flex gap-3 text-2xl flex-col bg-gray-400 mt-20">
        <h1 className="text-5xl">Welcome to miniature shop!</h1>

        {(user?.role === "admin" || user?.role === "editor") && (
          <a
            href={l.SITE_DASHBOARD}
            className="hover:text-red-300 bg-gray-500 w-32"
          >
            Dashboard
          </a>
        )}
        {user ? (
          <div>
            <h1 className="text-5xl">Name: {user?.name}</h1>
            <h1 className="text-5xl">Role: {user?.role}</h1>
            <Logout />
          </div>
        ) : (
          <div className="flex gap-3 text-2xl ">
            <a
              href="/#login"
              className="hover:underline hover:hover-text-light"
            >
              Sign in
            </a>
            <a
              href="/#register"
              className="hover:underline hover:hover-text-light"
            >
              Sign up
            </a>
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
