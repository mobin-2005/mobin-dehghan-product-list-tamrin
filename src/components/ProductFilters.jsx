
function ProductFilters({
  searchTerm,
  setSearchTerm,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  setCurrentPage,
}) {
  return (
    <div className="product-filters">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="price-filter">
        <label htmlFor="minPrice">Minimum price ($): </label>
        <input
          id="minPrice"
          type="number"
          min="0"
          placeholder="Min price"
          value={minPrice}
          onChange={(event) => {
            setMinPrice(event.target.value);
            setCurrentPage(1);
          }}
        />

        <label htmlFor="maxPrice">Maximum price ($): </label>
        <input
          id="maxPrice"
          type="number"
          min="0"
          placeholder="Max price"
          value={maxPrice}
          onChange={(event) => {
            setMaxPrice(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <label htmlFor="category">Filter by category: </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(event) => {
          setSelectedCategory(event.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="all">All products</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="sort">Sort by price: </label>
      <select
        id="sort"
        value={sortOrder}
        onChange={(event) => {
          setSortOrder(event.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="default">Default</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
      </select>
    </div>
  );
}

export default ProductFilters;
