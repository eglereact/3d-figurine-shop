import * as l from "../../Constants/urls";

const ProductCard = ({ p }) => {
  console.log(p.id);

  return (
    <div className="">
      <a
        href={l.SITE_PRODUCT + "/" + p.id}
        className="group bg-sand relative overflow-hidden block rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
      >
        <div className="relative p-6">
          <img
            src={`${l.SERVER_IMAGES_URL}/${p.photo}`}
            alt={p.title}
            className="w-full h-auto rounded-t-lg"
          />
        </div>
        <div className="bg-pink text-grey pt-4">
          <h2 className="text-2xl px-4">${p.price.toFixed(2)}</h2>
          <div className="px-4 pb-16">
            <h3 className="text-sm font-medium uppercase">{p.title}</h3>
          </div>

          <div className="flex justify-center absolute bottom-0 left-0 right-0 bg-pink transform translate-y-full group-hover:translate-y-0 transition duration-300 ease-in-out">
            <button className="w-1/3 py-2 text-grey text-center bg-pink border-[0.5px] border-[#3A3A3E] mb-2 rounded button-empty-animation ">
              Add To Cart
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};
export default ProductCard;
