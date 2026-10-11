import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);

        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];

        setCategories(uniqueCategories);
      })
      .catch(() => {
        setError("خطا در دریافت محصولات!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
const filteredProducts =
  selectedCategory === "all"
    ? products
    : products.filter(
        (product) => product.category === selectedCategory
      );

const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortOrder === "low-to-high") {
    return a.price - b.price;
  }

  if (sortOrder === "high-to-low") {
    return b.price - a.price;
  }

  return 0;
});

  if (loading) return <p>در حال دریافت محصولات...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Products</h2>

      <label htmlFor="category">Filter by category: </label>

      <select
        id="category"
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
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
  onChange={(event) => setSortOrder(event.target.value)}
>
  <option value="default">Default</option>
  <option value="low-to-high">Price: Low to High</option>
  <option value="high-to-low">Price: High to Low</option>
</select>

      <div className="product-list">
        {sortedProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.title}
              width="120"
              height="120"
            />

            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <p>{product.category}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
