import React from "react";

const Filters = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  priceFilter,
  setPriceFilter,
  withDiscount,
  setWithDiscount,
  withoutDiscount,
  setWithoutDiscount,
  inStock,
  setInStock,
  outOfStock,
  setOutOfStock,
  ratingFilter,
  setRatingFilter,
}) => {
  return (
    <section className="max-width p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-pink rounded-lg uppercase p-2 min-w-32">
          <label className="text-xs">Filter by Price:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Min"
              value={priceFilter.min}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, min: e.target.value })
              }
              className="border p-2 h-8 w-full outline-none"
            />
            <input
              type="text"
              placeholder="Max"
              value={priceFilter.max}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, max: e.target.value })
              }
              className="border p-2 h-8 w-full outline-none"
            />
          </div>
        </div>
        {/* Discount Filter */}

        <div className="flex-1 bg-pink flex flex-col justify-center rounded-lg uppercase p-2">
          <div className="flex items-center mb-2">
            <input
              id="with-discount"
              type="checkbox"
              checked={withDiscount}
              onChange={(e) => setWithDiscount(e.target.checked)}
              className="border p-2 accent-[#3A3A3E]"
            />
            <label
              htmlFor="with-discount"
              className="text-xs ml-2 cursor-pointer"
            >
              On sale
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="without-discount"
              type="checkbox"
              checked={withoutDiscount}
              onChange={(e) => setWithoutDiscount(e.target.checked)}
              className="border p-2 accent-[#3A3A3E]"
            />
            <label
              htmlFor="without-discount"
              className="text-xs ml-2 cursor-pointer"
            >
              no sale
            </label>
          </div>
        </div>
        {/* Stock Filter */}
        <div className="flex-1 flex flex-col justify-center bg-pink rounded-lg uppercase p-2 min-w-32">
          <div className="flex items-center mb-2">
            <input
              id="in-stock"
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="border p-2 accent-[#3A3A3E]"
            />
            <label htmlFor="in-stock" className="text-xs ml-2 cursor-pointer">
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="out-of-stock"
              type="checkbox"
              checked={outOfStock}
              onChange={(e) => setOutOfStock(e.target.checked)}
              className="border p-2 accent-[#3A3A3E]"
            />
            <label
              htmlFor="out-of-stock"
              className="text-xs ml-2 cursor-pointer"
            >
              Out of Stock
            </label>
          </div>
        </div>
        {/* Rating Filter */}
        <div className="flex-1 bg-pink flex flex-col justify-center rounded-lg uppercase ">
          <label className="pl-2 text-xs">Minimum Rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border pl-2 pt-2 w-full bg-pink border-none cursor-pointer uppercase text-xs"
          >
            <option value="">Any Rating</option>
            <option value="1" className="text-lg text-grey">
              ★☆☆☆☆
            </option>
            <option value="2" className="text-lg text-grey">
              ★★☆☆☆
            </option>
            <option value="3" className="text-lg text-grey">
              ★★★☆☆
            </option>
            <option value="4" className="text-lg text-grey">
              ★★★★☆
            </option>
            <option value="5" className="text-lg text-grey">
              ★★★★★
            </option>
          </select>
        </div>
        {/* //Sort */}
        <div className="flex-1 bg-pink flex flex-col justify-center rounded-lg uppercase ">
          <label className="pl-2 text-xs">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border pl-2 pt-2 w-full bg-pink border-none cursor-pointer uppercase text-xs"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="date-newest">Newest</option>
            <option value="date-oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="w-64 p-3 bg-pink rounded-lg">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded outline-none p-2 w-full "
        />
      </div>
    </section>
  );
};

export default Filters;
