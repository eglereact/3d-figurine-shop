import { SERVER_IMAGES_URL } from "../../Constants/urls";
import { IoClose } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";

export default function Image({
  handleImage,
  imageName,
  imageInput,
  image,
  clearImage,
  name,
  errors = {},
}) {
  const imgPath = image?.length > 40 ? "" : SERVER_IMAGES_URL;

  return (
    <>
      {/* <label className="img-label" htmlFor={name}>
        Add image: {imageName}
      </label> */}
      <input
        className={errors[name] ? "error" : ""}
        id={name}
        onChange={handleImage}
        ref={imageInput}
        type="file"
        name={name}
      />
      <div className="w-96">
        {image ? (
          <div className="bg-sand rounded-lg mt-6 relative p-6">
            <img src={imgPath + image} alt="uploaded" />
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={clearImage}
            >
              <IoClose size={25} />
            </span>
          </div>
        ) : null}
      </div>
      <div className="error-text">
        {errors[name] && (
          <span className=" flex items-center text-[#984B2C]">
            {errors[name]} <CiCircleAlert size={30} />
          </span>
        )}
      </div>
    </>
  );
}
