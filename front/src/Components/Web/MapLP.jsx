import React from "react";

const MapLP = () => {
  return (
    <>
      <div className="max-width flex justify-center">
        <div className="bg-pink w-2/3 flex gap-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18356.484193170072!2d23.88113908434219!3d54.89308343874395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e72272ce0e6e13%3A0xd99631cc7f3d8811!2sCentras%2C%20Kaunas%2C%20Kauno%20m.%20sav.!5e0!3m2!1slt!2slt!4v1725875636991!5m2!1slt!2slt"
            width="450"
            height="450"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="text-grey">
            <h1 className="text-5xl uppercase mt-10">Visit Us!</h1>
            <p className="my-2">
              1 Park Ave,
              <br /> Kaunas
            </p>
            <p>(555) 555-5555</p>
            <h2 className="text-3xl uppercase mt-10">Store Hours</h2>
            <p className="my-2">Monday - Friday</p>
            <p>10am - 6pm</p>
            <a
              href="https://www.google.com/maps/dir//54.8972808,23.9133352/@54.8965544,23.9145091,15.75z/data=!4m2!4m1!3e0?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
              className="w-full mt-6 active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
            >
              get directions
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapLP;
