const ProductPrice = ({
  price,
  discount,
  cartPage = false,
  productPage = false,
  landingPage = false,
}) => {
  const discountAmount = (discount / 100) * price;
  const finalPrice = price - discountAmount;

  if (productPage === true) {
    return (
      <div>
        {discount > 0 ? (
          <>
            <h2 className="text-2xl line-through">€{price.toFixed(2)}</h2>
            <h2 className="text-5xl text-brown">€{finalPrice.toFixed(2)}</h2>
          </>
        ) : (
          <h2 className="text-5xl ">€{price.toFixed(2)}</h2>
        )}
      </div>
    );
  }
  if (landingPage === true) {
    return (
      <div>
        {discount ? (
          <>
            <h2 className="text-2xl line-through text-white">
              ${price.toFixed(2)}
            </h2>
            <h2 className="text-5xl text-brown">€{finalPrice.toFixed(2)}</h2>
          </>
        ) : (
          <h2 className="text-5xl text-white">€{price.toFixed(2)}</h2>
        )}
      </div>
    );
  }

  if (cartPage === true) {
    return <span className="text-brown"> €{finalPrice.toFixed(2)}</span>;
  }

  return (
    <div className="flex gap-2">
      <p className="line-through">€{price.toFixed(2)}</p>
      <p className="text-brown"> €{finalPrice.toFixed(2)}</p>
    </div>
  );
};

export default ProductPrice;
