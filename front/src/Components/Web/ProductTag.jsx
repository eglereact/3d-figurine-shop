import React from "react";
import { FaDiceD20 } from "react-icons/fa";
import { GiDungeonGate } from "react-icons/gi";
import { FaShieldAlt } from "react-icons/fa";
const ProductTag = () => {
  return (
    <section className="grid sm:grid-cols-3 gap-10 mt-6 text-center">
      <div className="bg-pink p-6 text-grey rounded-lg gap-2 flex flex-col items-center">
        <FaDiceD20 size={30} />
        <h3 className="uppercase text-lg font-bold">Crafted for Gamers</h3>
        <p>
          Our miniature designs are developed in collaboration with expert
          modelers and tabletop enthusiasts.
        </p>
      </div>
      <div className="bg-pink p-6 text-grey rounded-lg gap-2 flex flex-col items-center">
        <GiDungeonGate size={30} />
        <h3 className="uppercase text-lg font-bold">Impeccable Detail</h3>
        <p>
          Each miniature is brought to life by our team of skilled artists,
          combining artistry with cutting-edge 3D modeling techniques.
        </p>
      </div>
      <div className="bg-pink p-6 text-grey rounded-lg gap-2 flex flex-col items-center">
        <FaShieldAlt size={30} />
        <h3 className="uppercase text-lg font-bold">Built to Endure</h3>
        <p>
          We use high-quality materials to ensure that our miniatures withstand
          the rigors of gameplay while maintaining intricate details.
        </p>
      </div>
    </section>
  );
};

export default ProductTag;
