import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io";

const Contacts = () => {
  return (
    <>
      <Header />
      <section className="max-width flex justify-center py-10">
        <div className="bg-pink p-6 rounded-lg w-2/3">
          <h1 className="text-4xl text-center uppercase text-grey">
            Contact me:
          </h1>
          <h2 className="text-grey text-3xl mt-6 text-center">
            jukneviciute185@gmail.com
          </h2>
          <div className="flex p-6 gap-20 justify-center">
            <div>
              <img src="images/qr-eglereact6.png" alt="eglereact" />
              <p className="flex items-center justify-center uppercase text-2xl text-grey">
                <IoLogoGithub size={50} />
                eglereact
              </p>
            </div>
            <div>
              <img src="images/qr-linkedin6.png" alt="linkedin" />
              <p className="flex items-center justify-center uppercase text-2xl text-grey pt-1">
                <IoLogoLinkedin size={50} />
                Eglė juknevičiutė
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contacts;
