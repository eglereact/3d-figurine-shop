import React, { useState } from "react";
import Panel from "./Panel";
import { panels } from "../../Constants/panels";

function FAQ() {
  const [activeTab, setActiveTab] = useState(-1);

  const handleTabClick = (index) => {
    setActiveTab((prev) => (prev === index ? -1 : index));
  };

  return (
    <>
      <div className="max-width flex justify-center my-20">
        <div
          className="bg-pink mx-6 lg:mx-0  p-6 lg:w-2/3 flex gap-10 rounded-lg md:flex-row flex-col"
          data-aos="fade-down"
          data-aos-once={true}
        >
          <div className="text-grey w-full md:w-2/5">
            <h1 className="text-5xl uppercase">Need Help?</h1>
            <p className="text-sm">We offer support via email.</p>
            <div className="uppercase text-grey text-xs  mt-6">
              <p>Email</p>
              <p className="font-bold">support@dndminiatureshop.com</p>
            </div>
            <div className="uppercase text-grey text-xs  mt-6">
              <p>Hours</p>
              <p className="font-bold">Monday - Friday, 9AM - 5PM CET</p>
            </div>
            <div className="uppercase text-grey text-xs  mt-6">
              <p>Average response time</p>
              <p className="font-bold">1 Business day</p>
            </div>
          </div>
          <div className="w-full md:w-3/5">
            {panels?.map((panel, index) => (
              <Panel
                key={index}
                isActive={activeTab === index}
                onClick={() => handleTabClick(index)}
                {...panel}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;
