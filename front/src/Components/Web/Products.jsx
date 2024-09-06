import React, { useState, useEffect } from "react";
import useServerGet from "../../Hooks/useServerGet";
import * as l from "../../Constants/urls";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import Filters from "./Filters";

const Products = () => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SERVER_GET_WEB_PRODUCTS
  );

  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [withDiscount, setWithDiscount] = useState(false);
  const [withoutDiscount, setWithoutDiscount] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("");

  // Fetch products on mount
  useEffect(() => {
    doGet();
  }, [doGet]);

  // Update products state once when server response comes
  useEffect(() => {
    if (serverGetResponse?.data?.products && !products) {
      setProducts(serverGetResponse.data.products);
    }
  }, [serverGetResponse, products]);

  // Apply filtering and sorting when the products, filters, or sort option changes
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter.min || priceFilter.max) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        const min = priceFilter.min ? parseFloat(priceFilter.min) : 0;
        const max = priceFilter.max ? parseFloat(priceFilter.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filter by discount or no discount
    if (withDiscount) {
      filtered = filtered.filter((product) => product.discount > 0);
    } else if (withoutDiscount) {
      filtered = filtered.filter((product) => product.discount === 0);
    }

    // Filter by stock status
    if (inStock) {
      filtered = filtered.filter((product) => product.in_stock);
    } else if (outOfStock) {
      filtered = filtered.filter((product) => !product.in_stock);
    }

    // Filter by rating
    if (ratingFilter) {
      filtered = filtered.filter((product) => product.rating >= ratingFilter);
    }

    // Sort the products
    if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "name-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "date-newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "date-oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    priceFilter,
    withDiscount,
    withoutDiscount,
    inStock,
    outOfStock,
    ratingFilter,
    sortOption,
  ]);

  return (
    <>
      <Header />

      {/* Filters Component */}
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        withDiscount={withDiscount}
        setWithDiscount={setWithDiscount}
        withoutDiscount={withoutDiscount}
        setWithoutDiscount={setWithoutDiscount}
        inStock={inStock}
        setInStock={setInStock}
        outOfStock={outOfStock}
        setOutOfStock={setOutOfStock}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />

      <section className="max-width grid grid-cols-2 md:grid-cols-3 gap-6 p-6 gap-y-20">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((p) => <ProductCard key={p.id} p={p} />)
        )}
      </section>

      <Footer />
    </>
  );
};

export default Products;
