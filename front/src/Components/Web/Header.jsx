import AOS from "aos";
import "aos/dist/aos.css";
import React, { useContext, useEffect, useState } from "react";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import { CiShoppingCart, CiUser, CiCircleRemove } from "react-icons/ci";
import * as l from "../../Constants/urls";
import { AuthContext } from "../../Contexts/Auth";
import Logout from "../Common/Logout";
import Gate from "../Common/Gate";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const links = [
    { id: 1, link: l.SITE_PRODUCTS, name: "Products" },
    { id: 2, link: "/#", name: "Blog" },
    { id: 3, link: "/#", name: "Sale" },
    { id: 4, link: "/#", name: "Contacts" },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.querySelectorAll(".menu li").forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateX(-100px)";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
          item.style.transition = `transform 0.5s ease ${
            index * 0.2
          }s, opacity 0.5s ease ${index * 0.2}s`;
        }, 10);
      });
    } else {
      document.querySelectorAll(".menu li").forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
        item.style.transition = "none";
      });
    }
  }, [isMenuOpen]);

  return (
    <header>
      <nav className="bg-white w-full z-20 top-0 left-0 max-width p-6">
        <ul className=" flex flex-wrap justify-between items-center relative mx-auto py-4 text-grey">
          <a href="/#">
            <img src="/images/logo.png" className="w-28" />
          </a>
          <input
            type="checkbox"
            id="check"
            checked={isMenuOpen}
            onChange={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: "none" }}
          />
          <span
            className={`menu flex [&>li]:pl-3 [&>li>a]:text-center [&>li>a]:relative [&>li>a]:transition [&>li>a]:duration-200 [&>li>a]:ease-in-out [&>li>a]:font-medium [&>li>a]:text-lg ${
              isMenuOpen ? "open" : ""
            }`}
          >
            <a className="flex sm:hidden pt-6" href="/#">
              <img src="/images/logo2.png" className="w-28" />
            </a>
            {links.map((l) => (
              <li data-aos="fade-right" key={l.id}>
                <a
                  className="sm:hidden cursor-pointer border-b-2 border-transparent hover:text-gray-400 hover:border-gray-400 py-1 px-0 transition duration-200 ease-in-out"
                  href={l.link}
                >
                  {l.name}
                </a>
              </li>
            ))}
            <div className="flex gap-3 justify-center items-center">
              <li data-aos="fade-right" className="">
                <a
                  href="#"
                  className="flex justify-center items-center transition duration-200 ease-in-out group"
                >
                  <CiSearch className="text-3xl transform transition duration-200 ease-in-out group-hover:scale-110" />
                  <span className="uppercase text-xs">search</span>
                </a>
              </li>
              {user === null ? (
                <li data-aos="fade-right">
                  <a href={l.SITE_LOGIN} className="nav-icons-animation">
                    <CiUser className="text-3xl" />
                  </a>
                </li>
              ) : (
                <li data-aos="fade-right" className="">
                  <a
                    href={l.USER_PROFILE}
                    className="flex justify-center items-center transition duration-200 ease-in-out group"
                  >
                    <CiUser className="text-3xl transform transition duration-200 ease-in-out group-hover:scale-110" />
                    <span className="uppercase text-xs">{user?.name}</span>
                  </a>
                </li>
              )}

              <li data-aos="fade-right">
                <a href="#" className="nav-icons-animation">
                  <CiShoppingCart className="text-3xl" />
                </a>
              </li>
              <Gate status="logged">
                <li>
                  <Logout className="p-2 rounded border-[0.5px] border-[#3A3A3E] button-empty-animation small-screen-btn uppercase text-sm" />
                </li>
              </Gate>
              <Gate status="role" role={["admin", "editor"]}>
                <li>
                  <a
                    href={l.SITE_DASHBOARD}
                    className="p-2 rounded border-[0.5px] border-[#3A3A3E] button-empty-animation small-screen-btn uppercase text-sm"
                  >
                    Dashboard
                  </a>
                </li>
              </Gate>
            </div>
            <label htmlFor="check" className="close-menu">
              <CiCircleRemove className="text-4xl nav-icons-animation" />
            </label>
          </span>
          <label htmlFor="check" className="open-menu">
            <CiMenuBurger className="text-3xl nav-icons-animation" />
          </label>
        </ul>
        <ul className="hidden sm:flex gap-8 text-lg uppercase ">
          {links.map((l) => (
            <li
              data-aos="fade-right"
              key={l.id}
              className="border-b-2 border-transparent hover:text-gray-400 hover:border-gray-400 p-1 transition duration-200 ease-in-out"
            >
              <a href={l.link}>{l.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
