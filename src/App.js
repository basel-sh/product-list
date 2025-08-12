import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ track when loaded

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load cart count from localStorage when page loads
  useEffect(() => {
    const savedCartCount = localStorage.getItem("cartCount");
    if (savedCartCount !== null) {
      setCartCount(parseInt(savedCartCount, 10));
    }
    setIsLoaded(true); // ✅ mark as loaded
  }, []);

  // Save cart count to localStorage whenever it changes AFTER loading
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cartCount", cartCount.toString());
    }
  }, [cartCount, isLoaded]);

  // Fetch products
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Cart actions
  const addToCart = () => setCartCount((prev) => prev + 1);
  const clearCart = () => setCartCount(0);

  // Get categories list
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    let matchesPrice = true;

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      matchesPrice = product.price >= min && product.price <= max;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="logo">🛍 E-Shop Demo</div>
        <div className="task">Frontend Recruitment Task</div>
        <div className="cart">
          🛒 Cart: {cartCount}{" "}
          <button onClick={clearCart} className="btn clear">
            Clear
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="content">
        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="0-25">$0 - $25</option>
            <option value="25-50">$25 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-1000">$100+</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="card">
                <img src={product.image} alt={product.title} />
                <h2>{product.title}</h2>
                <p className="category">{product.category}</p>
                <p className="price">${product.price}</p>
                <p className="desc">{product.description.slice(0, 80)}...</p>
                <div className="actions">
                  <button onClick={addToCart} className="btn add">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="btn details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      {/* Modal for View Details */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <h2>{selectedProduct.title}</h2>
            <p className="category">{selectedProduct.category}</p>
            <p className="price">${selectedProduct.price}</p>
            <p className="desc">{selectedProduct.description}</p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="btn close"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fixed Footer */}
      <footer className="footer">
        © 2025 Basel Shrief Hemaid | Baselshm@gmail.com | Frontend Recruitment
        Task
      </footer>
    </div>
  );
}

export default App;
