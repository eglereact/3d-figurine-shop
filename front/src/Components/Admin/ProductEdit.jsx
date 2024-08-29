import { useContext, useEffect, useState, useRef } from "react";
import * as l from "../../Constants/urls";
import Input from "../Forms/Input";
import Image from "../Forms/Image";
import Textarea from "../Forms/Textarea";
import { LoaderContext } from "../../Contexts/Loader";
import { RouterContext } from "../../Contexts/Router";
import useServerGet from "../../Hooks/useServerGet";
import useServerPut from "../../Hooks/useServerPut";
import Select from "../Forms/Select";

export default function ProductEdit() {
  const { params } = useContext(RouterContext);
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_EDIT_PRODUCT
  );
  const { doAction: doPut, serverResponse: serverPutResponse } = useServerPut(
    l.SERVER_UPDATE_PRODUCT
  );
  const [product, setProduct] = useState(null);
  const { setShow } = useContext(LoaderContext);
  const [imageName, setImageName] = useState("No image");

  useEffect(() => {
    doGet("/" + params[1]);
  }, [doGet, params]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    console.log(serverGetResponse);

    setProduct(serverGetResponse.data.product ?? null);
  }, [serverGetResponse]);

  useEffect(() => {
    if (null === serverPutResponse) {
      return;
    }
    if ("success" === serverPutResponse.type) {
      window.location.hash = l.PRODUCTS_LIST;
    }
  }, [serverPutResponse]);

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
        setImageName("No image");
      });
  };

  const clearImage = () => {
    imageInput.current.value = null;
    setProduct((p) => ({ ...p, photo: null }));
    setImageName("No image");
  };

  const submit = () => {
    //TODO: Validation
    setShow(true);
    doPut(product);
  };

  return (
    <>
      <section id="banner">
        <div className="content">
          <header>
            <h1 className="text-5xl mb-4">Update Product</h1>
          </header>
        </div>
      </section>
      <section>
        {null === product && <h3>Loading...</h3>}
        {null !== product && (
          <div className="row aln-center">
            <div className="col-8 col-8-large col-10-medium col-12-small">
              <form>
                <div className="flex flex-col gap-5 ">
                  <Select
                    onChange={handleForm}
                    value={product.approved}
                    name="approved"
                    options={[
                      { value: 0, label: "not approved" },
                      { value: 1, label: "approved" },
                    ]}
                    label="Select Approved"
                  />
                  <Select
                    onChange={handleForm}
                    value={product.featured}
                    name="featured"
                    options={[
                      { value: 0, label: "not featured" },
                      { value: 1, label: "featured" },
                    ]}
                    label="Select Featured"
                  />
                  <div className="">
                    <Input
                      onChange={handleForm}
                      value={product.title}
                      type="text"
                      name="title"
                      label="Title"
                      placeholder="title"
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      onChange={handleForm}
                      value={product.price}
                      type="text"
                      name="price"
                      label="Price"
                      placeholder="price"
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
                      placeholder="in stock"
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      onChange={handleForm}
                      value={product.discount}
                      type="text"
                      name="discount"
                      label="discount"
                      placeholder="discount"
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
