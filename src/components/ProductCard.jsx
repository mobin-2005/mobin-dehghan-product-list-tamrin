
import SimilarProducts from "./SimilarProducts";

function ProductCard({
  product,
  onAddToCart,
  selectedProduct,
  products,
  onCloseSimilar,
}) {
  const showSimilar = selectedProduct?.id === product.id;

  return (
    <article className="product-card">
      <img
        src={product.image}
        alt={product.title}
        width="120"
        height="120"
      />

      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <p>{product.category}</p>

      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>

      {showSimilar && (
        <SimilarProducts
          product={product}
          products={products}
          onAddToCart={(item) => onAddToCart(item, false)}
          onClose={onCloseSimilar}
        />
      )}
    </article>
  );
}

export default ProductCard;
