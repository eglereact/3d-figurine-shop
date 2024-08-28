import { MdDashboard } from "react-icons/md";
import { FaUsers, FaFile, FaDonate } from "react-icons/fa";
import * as l from "../../Constants/urls";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";
import Logout from "../Common/Logout";
import Gate from "../Common/Gate";
import Redirect from "../Common/Redirect";

const Sidebar = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Gate status="role" role={["admin", "editor"]}>
        <div className="flex flex-col ">
          <div className="bg-gray-500 h-16  flex items-center pl-10 justify-between">
            <div className="center-all gap-4 mr-8">
              <p className="text-white">
                Hello,{" "}
                <span className="font-bold capitalize">{user?.name}</span>
              </p>

              <a className="button-light py-2" href={l.SITE_HOME}>
                Home
              </a>
            </div>
            <Logout />
          </div>
          <div className="flex ">
            <div
              className={`bg-gray-900 w-20 md:w-64 text-gray-400 overflow-hidden p-5 transition-width duration-300 `}
            >
              <ul className="mt-10">
                <li className="mb-4 h-10">
                  <a
                    href={l.SITE_DASHBOARD}
                    className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                  >
                    <MdDashboard className="text-lg md:text-xl " />
                    <span className="flex">Dashboard</span>
                  </a>
                </li>
                {user?.role === "admin" && (
                  <li className="mb-4 h-10">
                    <a
                      href={l.USERS_LIST}
                      className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                    >
                      <FaUsers className="text-lg md:text-xl " />
                      <span className="flex">Users</span>
                    </a>
                  </li>
                )}
                <li className="mb-4 h-10">
                  <a
                    href={l.PRODUCTS_LIST}
                    className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                  >
                    <MdDashboard className="text-lg md:text-xl " />
                    <span className="flex">Products</span>
                  </a>
                </li>
                <li className="mb-4 h-10">
                  <a
                    href={"/" + l.PRODUCT_ADD}
                    className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                  >
                    <MdDashboard className="text-lg md:text-xl " />
                    <span className="flex">New Product</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1 min-h-screen p-10 bg-gray-100">
              {children}
            </div>
          </div>
        </div>
      </Gate>
      <Gate status="not-logged">
        <Redirect to="SITE_HOME" />
      </Gate>
      <Gate status="role" role={["user"]}>
        <Redirect to="SITE_HOME" />
      </Gate>
    </>
  );
};

export default Sidebar;
