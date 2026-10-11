
function ShoppingCart({ cart, onRemove }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="shopping-cart">
      <h2>Shopping Cart ({cart.length} products)</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <h3>{item.title}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button onClick={() => onRemove(item.id)}>
              Remove One
              </button>
            </article>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>
        </>
      )}
    </section>
  );
}

export default ShoppingCart;
