
import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("دریافت محصولات ناموفق بود");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("خطا در دریافت محصولات!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>در حال دریافت محصولات...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-list">
      {products.map((product) => (
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
  );
}

export default ProductList;
