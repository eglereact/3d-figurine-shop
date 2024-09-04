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
    console.log(product);
  };

  return (
    <>
      <section id="banner">
        <div className="content">
          <header>
            <h1 className="text-5xl mb-4">New Product</h1>
          </header>
        </div>
      </section>
      <section>
        {null === product && <h3>Loading...</h3>}
        {null !== product && (
          <div className="row aln-center">
            <div className="col-8 col-8-large col-10-medium col-12-small ">
              <form className="flex flex-col">
                <div className="flex flex-col sm:flex-row gap-6  mt-6">
                  <div className="w-full sm:w-1/2 flex flex-col gap-6">
                    <Input
                      onChange={handleForm}
                      value={product.title}
                      type="text"
                      name="title"
                      label="Title"
                      placeholder="title"
                    />

                    <Input
                      onChange={handleForm}
                      value={product.price}
                      type="text"
                      name="price"
                      label="Price"
                      placeholder="price"
                    />

                    <Textarea
                      onChange={handleForm}
                      value={product.info}
                      type="text"
                      name="info"
                      label="Info"
                      placeholder="Info"
                    />

                    <Input
                      onChange={handleForm}
                      value={product.in_stock}
                      type="text"
                      name="in_stock"
                      label="In Stock"
                      placeholder="in stock"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <Image
                      handleImage={handleImage}
                      imageInput={imageInput}
                      imageName={imageName}
                      image={product.photo}
                      clearImage={clearImage}
                      name="photo"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <ul className="flex gap-5">
                    <li>
                      <input
                        onClick={submit}
                        type="button"
                        value="Save"
                        className="grey-button"
                      />
                    </li>
                    <li className="grey-button ">
                      <a href={"/" + l.PRODUCTS_LIST}>All products</a>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
