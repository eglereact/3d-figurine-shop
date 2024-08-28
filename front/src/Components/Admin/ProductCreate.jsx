import { useContext, useEffect, useState, useRef } from "react";
import useServerPost from "../../Hooks/useServerPost";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import Image from "../Forms/Image";
import Textarea from "../Forms/Textarea";
import { LoaderContext } from "../../Contexts/Loader";
// import { rem } from "../../Constants/icons";

export default function ProductCreate() {
  const { doAction: doPost, response: serverPostResponse } = useServerPost(
    l.SERVER_STORE_PRODUCT
  );
  const [product, setProduct] = useState({
    title: "",
    price: "",
    info: "",
    in_stock: "",
    photo: null,
  });
  const { setShow } = useContext(LoaderContext);
  const [imageName, setImageName] = useState("Image not selected");

  useEffect(() => {
    if (null === serverPostResponse) {
      return;
    }
    if ("success" === serverPostResponse.type) {
      window.location.hash = l.PRODUCTS_LIST;
    }
  }, [serverPostResponse]);

  const handleForm = (e) => {
    setProduct((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const imageInput = useRef();

  const imageReader = (img) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImage = (e) => {
    imageReader(e.target.files[0])
      .then((res) => {
        setProduct((p) => ({ ...p, photo: res }));
        setImageName(imageInput.current.value.replace("C:\\fakepath\\", ""));
      })
      .catch(() => {
        setProduct((p) => ({ ...p, photo: null }));
        setImageName("Image not selected");
      });
  };

  const clearImage = () => {
    imageInput.current.value = null;
    setProduct((p) => ({ ...p, photo: null }));
    setImageName("Image not selected");
  };

  const submit = () => {
    //TODO: Validation
    setShow(true);
    doPost(product);
  };

  return (
    <>
      <section id="banner">
        <div className="content">
          <header>
            <h1>New Product</h1>
          </header>
        </div>
      </section>
      <section>
        {null === product && <h3>Loading...</h3>}
        {null !== product && (
          <div className="row aln-center">
            <div className="col-8 col-8-large col-10-medium col-12-small">
              <form>
                <div className="row gtr-uniform">
                  <div className="col-12">
                    <Input
                      onChange={handleForm}
                      value={product.title}
                      type="text"
                      name="title"
                      label="Title"
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      onChange={handleForm}
                      value={product.price}
                      type="text"
                      name="price"
                      label="Price"
                    />
                  </div>
                  <div className="col-12">
                    <Textarea
                      onChange={handleForm}
                      value={product.info}
                      type="text"
                      name="info"
                      label="Info"
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      onChange={handleForm}
                      value={product.in_stock}
                      type="text"
                      name="in_stock"
                      label="In Stock"
                    />
                  </div>
                  <div className="col-12">
                    <Image
                      handleImage={handleImage}
                      imageInput={imageInput}
                      imageName={imageName}
                      image={product.photo}
                      clearImage={clearImage}
                      //   rem={rem}
                      name="photo"
                    />
                  </div>

                  <div className="col-12">
                    <ul className="flex gap-5">
                      <li className="bg-gray-800 cursor-pointer p-4 text-white">
                        <input onClick={submit} type="button" value="Save" />
                      </li>
                      <li className="bg-gray-800 cursor-pointer p-4 text-white">
                        <a href={"/" + l.PRODUCTS_LIST}>All products</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
