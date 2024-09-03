import { SERVER_IMAGES_URL } from "../../Constants/urls";
import { IoClose } from "react-icons/io5";

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
      <div className="error-text">
        <span className={errors[name] ? "show" : ""}>{errors[name] ?? ""}</span>
      </div>
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
    </>
  );
}
