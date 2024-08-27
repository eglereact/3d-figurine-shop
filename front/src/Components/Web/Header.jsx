import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
      <nav className="bg-white w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <ul className="navigation max-w-[90vw] flex flex-wrap justify-between items-center relative mx-auto py-8">
          <a className="logo" href="#">
            <h3 className="font-bold text-2xl">LOGO</h3>
          </a>
          <input
            type="checkbox"
            id="check"
            checked={isMenuOpen}
            onChange={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: "none" }}
          />
          <span
            className={`menu flex [&>li]:pl-8 [&>li>a]:text-center [&>li>a]:relative [&>li>a]:transition [&>li>a]:duration-200 [&>li>a]:ease-in-out [&>li>a]:font-medium [&>li>a]:text-lg ${
              isMenuOpen ? "open" : ""
            }`}
          >
            <h1 className="flex sm:hidden">Epic Miniatures</h1>
            <li data-aos="fade-right">
              <a href="#">Home</a>
            </li>
            <li data-aos="fade-right">
              <a href="#">About</a>
            </li>
            <li data-aos="fade-right">
              <a href="#">Projects</a>
            </li>
            <li data-aos="fade-right">
              <a href="#">Resources</a>
            </li>
            <li data-aos="fade-right">
              <a href="#">Contact</a>
            </li>
            <label htmlFor="check" className="close-menu">
              X
            </label>
          </span>
          <label htmlFor="check" className="open-menu">
            <CiMenuBurger />
          </label>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
