
import { useEffect, useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import ShoppingCart from "./ShoppingCart";
import Pagination from "./Pagination";

function getSavedFilters() {
  try {
    return JSON.parse(localStorage.getItem("productFilters")) || {};
  } catch {
    return {};
  }
}

function ProductList() {
  const [savedFilters] = useState(getSavedFilters);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    savedFilters.selectedCategory || "all"
  );
  const [sortOrder, setSortOrder] = useState(
    savedFilters.sortOrder || "default"
  );
  const [searchTerm, setSearchTerm] = useState(
    savedFilters.searchTerm || ""
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    savedFilters.searchTerm || ""
  );
  const [minPrice, setMinPrice] = useState(savedFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(savedFilters.maxPrice || "");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save filters
  useEffect(() => {
    localStorage.setItem(
      "productFilters",
      JSON.stringify({
        selectedCategory,
        sortOrder,
        searchTerm,
        minPrice,
        maxPrice,
      })
    );
  }, [selectedCategory, sortOrder, searchTerm, minPrice, maxPrice]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products and cache categories
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

        let cachedCategories;

        try {
          cachedCategories = JSON.parse(
            localStorage.getItem("categories")
          );
        } catch {
          cachedCategories = null;
        }

        if (
          Array.isArray(cachedCategories) &&
          cachedCategories.length > 0
        ) {
          setCategories(cachedCategories);
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

  // Filter products
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

  // Sort products
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

  // Add product to cart
  const addToCart = (product, showSimilar = true) => {
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

    if (showSimilar) {
      setSelectedProduct(product);
    }
  };

  // Remove product from cart

const removeFromCart = (productId) => {
  setCart((previousCart) =>
    previousCart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
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

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setCurrentPage={setCurrentPage}
      />

      <div className="product-list">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            products={products}
            selectedProduct={selectedProduct}
            onAddToCart={addToCart}
            onCloseSimilar={() => setSelectedProduct(null)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <ShoppingCart cart={cart} onRemove={removeFromCart} />
    </section>
  );
}

export default ProductList;
