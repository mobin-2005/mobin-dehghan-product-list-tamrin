import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

      <div className="product-list">
        {filteredProducts.map((product) => (
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
