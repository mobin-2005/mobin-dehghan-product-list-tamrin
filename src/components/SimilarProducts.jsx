
function SimilarProducts({ product, products, onAddToCart, onClose }) {
  const similarProducts = products.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  );

  return (
    <div className="similar-products">
      <h4>Similar Products</h4>

      {similarProducts.length === 0 ? (
        <p>No similar products found.</p>
      ) : (
        similarProducts.map((item) => (
          <div className="similar-product" key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              width="50"
              height="50"
            />

            <p>{item.title}</p>
            <p>${item.price}</p>

            <button onClick={() => onAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))
      )}

      <button onClick={onClose}>
        Close Similar Products
      </button>
    </div>
  );
}

export default SimilarProducts;