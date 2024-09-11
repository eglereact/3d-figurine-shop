import { MdDashboard } from "react-icons/md";
import { FaUsers, FaFile, FaDonate } from "react-icons/fa";
import * as l from "../../Constants/urls";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";
import Logout from "../Common/Logout";
import Gate from "../Common/Gate";
import Redirect from "../Common/Redirect";
import { TbDoorEnter } from "react-icons/tb";
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";

const Sidebar = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Gate status="role" role={["admin", "editor"]}>
        <div className="flex flex-col ">
          <div className="bg-grey h-16 flex items-center px-10 justify-between">
            <a
              className="text-white flex items-center gap-2"
              href={l.SITE_HOME}
            >
              <TbDoorEnter size={25} /> Home
            </a>
            <div className="flex items-center gap-6">
              <p className="text-white">
                Hello,{" "}
                <span className="font-bold capitalize">{user?.name}</span>
              </p>
              <Logout className="p-2 rounded border-[0.5px] border-white text-white button-empty-animation small-screen-btn uppercase text-sm" />
            </div>
          </div>
          <div className="flex ">
            <div
              className={`bg-white w-20 md:w-44  text-gray-400 overflow-hidden p-5 transition-width duration-300 `}
            >
              <ul className="mt-10 text-grey">
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
                    <FaShoppingBag className="text-lg md:text-xl " />
                    <span className="flex">Products</span>
                  </a>
                </li>
                <li className="mb-4 h-10">
                  <a
                    href={"/" + l.PRODUCT_ADD}
                    className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                  >
                    <MdNoteAdd className="text-lg md:text-xl " />
                    <span className="flex text-center">New Product</span>
                  </a>
                </li>
                <li className="mb-4 h-10">
                  <a
                    href={"/" + l.ORDERS_LIST}
                    className={`text-xs flex flex-col items-center md:text-lg md:flex-row md:gap-2`}
                  >
                    <FaShoppingCart className="text-lg md:text-xl " />
                    <span className="flex text-center">Orders</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1 min-h-screen p-10 bg-pink">{children}</div>
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
