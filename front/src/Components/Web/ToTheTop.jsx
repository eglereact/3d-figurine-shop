import React, { useEffect, useState } from "react";
import { CiCircleChevUp } from "react-icons/ci";

const ToTheTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {showButton && (
        <button
          className="fixed bottom-5 right-5 bg-pink text-grey rounded-full  p-2 shadow-lg transition-transform transform hover:scale-105 hover:bg-white"
          onClick={scrollToTop}
        >
          <CiCircleChevUp size={30} />
        </button>
      )}
    </div>
  );
};

export default ToTheTop;
