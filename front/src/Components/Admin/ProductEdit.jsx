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
import Gate from "../Common/Gate";
import Loading from "../Common/Loading";
import useCreateProduct from "../../Validations/useCreateProduct";

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
  const { errors, validateForm } = useCreateProduct();

  useEffect(() => {
    doGet("/" + params[1]);
  }, [doGet, params]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }

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
    if (!validateForm(product, product.photo)) return;
    setShow(true);
    doPut(product);
  };

  return (
    <>
      <h1 className="text-4xl mb-4 text-grey">Update Product</h1>
      <section>
        {null === product && <Loading />}
        {null !== product && (
          <form className="flex flex-col">
            <div className="flex gap-6">
              <div className="flex flex-col gap-5 w-1/2">
                <Gate status="role" role={["admin"]}>
                  <Select
                    onChange={handleForm}
                    value={product.approved}
                    name="approved"
                    options={[
                      { value: 0, label: "not approved" },
                      { value: 1, label: "approved" },
                    ]}
                    label="SELECT APPROVED"
                  />
                  <Select
                    onChange={handleForm}
                    value={product.featured}
                    name="featured"
                    options={[
                      { value: 0, label: "not featured" },
                      { value: 1, label: "featured" },
                    ]}
                    label="SELECT FEATURED"
                  />
                </Gate>

                <Input
                  onChange={handleForm}
                  value={product.title}
                  type="text"
                  name="title"
                  label="TITLE"
                  placeholder="title"
                  errors={errors}
                />
                <Input
                  onChange={handleForm}
                  value={product.price}
                  type="text"
                  name="price"
                  label="PRICE"
                  placeholder="price"
                  errors={errors}
                />
                <Input
                  onChange={handleForm}
                  value={product.in_stock}
                  type="text"
                  name="in_stock"
                  label="IN STOCK"
                  placeholder="in stock"
                  errors={errors}
                />
                <Input
                  onChange={handleForm}
                  value={product.discount}
                  type="text"
                  name="discount"
                  label="DISCOUNT"
                  placeholder="discount"
                  errors={errors}
                />

                <Textarea
                  onChange={handleForm}
                  value={product.info}
                  type="text"
                  name="info"
                  label="DESCRIPTION"
                  placeholder="info"
                  errors={errors}
                />
              </div>
              <div>
                <Image
                  handleImage={handleImage}
                  imageInput={imageInput}
                  imageName={imageName}
                  image={product.photo}
                  clearImage={clearImage}
                  name="photo"
                  errors={errors}
                />
              </div>
            </div>
            <div className="flex gap-6 mt-6">
              <input
                onClick={submit}
                type="button"
                value="Save"
                className="grey-button cursor-pointer uppercase"
              />

              <a href={"/" + l.PRODUCTS_LIST} className="grey-button">
                All products
              </a>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
