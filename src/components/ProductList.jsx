import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const productsPerPage = 6;

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

        const cachedCategories = localStorage.getItem("categories");

        if (cachedCategories) {
          try {
            setCategories(JSON.parse(cachedCategories));
          } catch {
            const uniqueCategories = [
              ...new Set(data.map((product) => product.category)),
            ];

            setCategories(uniqueCategories);
            localStorage.setItem(
              "categories",
              JSON.stringify(uniqueCategories)
            );
          }
        } else {
          const uniqueCategories = [
            ...new Set(data.map((product) => product.category)),
          ];

          setCategories(uniqueCategories);

          localStorage.setItem(
            "categories",
            JSON.stringify(uniqueCategories)
          );
        }
      })
      .catch(() => {
        setError("خطا در دریافت محصولات!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const matchesSearch = product.title
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());

    const matchesMinPrice =
      minPrice === "" || product.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || product.price <= Number(maxPrice);

    return (
      matchesCategory &&
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-to-low") {
      return b.price - a.price;
    }

    return 0;
  });

  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  };

  if (loading) {
    return <p>در حال دریافت محصولات...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Products</h2>

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

      {/* Price sorting */}
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

      <div className="product-list">
        {paginatedProducts.map((product) => (
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

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}

      {totalPages > 0 && (
        <div className="pagination">
          <button
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}

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
                  Subtotal: $
                  {(item.price * item.quantity).toFixed(2)}
                </p>

                <button onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </article>
            ))}

            <h3>
              Total: $
              {cart
                .reduce(
                  (total, item) =>
                    total + item.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </h3>
          </>
        )}
      </section>
    </section>
  );
}

export default ProductList;