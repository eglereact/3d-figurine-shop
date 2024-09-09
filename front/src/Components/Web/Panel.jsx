import React, { useState, useEffect, useRef } from "react";

const Panel = ({ icon, label, content, isActive, onClick }) => {
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setHeight(el.scrollHeight);
    }
  }, []);

  const innerStyle = {
    height: isActive ? `${height}px` : "0px",
    opacity: isActive ? 1 : 0,
  };

  return (
    <div className="panel bg-grey mb-3 last:mb-0 ">
      <button
        className="panel__label  relative flex items-center w-full bg-transparent border-none text-left px-6 py-6 text-sm cursor-pointer transition-colors duration-200 ease-linear focus:outline-none"
        role="tab"
        onClick={onClick}
        aria-expanded={isActive}
      >
        <span className="mr-2 text-lg"> {icon}</span> {label}
        <span className={`icon ${isActive ? "open" : "closed"}`}></span>
      </button>
      <div
        className="panel__inner overflow-hidden transition-all duration-400 ease-cubic"
        style={innerStyle}
        aria-hidden={!isActive}
        ref={contentRef}
      >
        <p className="panel__content mx-6 my-2 text-sm text-gray pb-6">
          {content}
        </p>
      </div>
    </div>
  );
};

export default Panel;
