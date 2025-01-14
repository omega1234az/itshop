import React from "react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="logo">Logo</div>
        <div className="search-bar">
          <input type="text" placeholder="ค้นหา..." />
          <button>🔍</button>
        </div>
        <button className="login-button">Login</button>
      </header>

      {/* Filters */}
      <section className="filters">
        <select>
          <option value="">Category</option>
          <option value="CPU">CPU</option>
          <option value="RAM">RAM</option>
          <option value="GPU">GPU</option>
        </select>
        <input type="number" placeholder="Min Price" />
        <input type="number" placeholder="Max Price" />
        <select>
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </section>

      {/* Product List */}
      <section className="product-list">
        <div className="product">
          <img src="https://via.placeholder.com/150" alt="Product 1" />
          <h3>Intel Core i5</h3>
          <p>฿8,000</p>
        </div>
        <div className="product">
          <img src="https://via.placeholder.com/150" alt="Product 2" />
          <h3>Intel Core i9</h3>
          <p>฿16,000</p>
        </div>
        <div className="product">
          <img src="https://via.placeholder.com/150" alt="Product 3" />
          <h3>Kingston Fury</h3>
          <p>฿3,500</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Logo</div>
        <div>ติดต่อสอบถาม</div>
        <div>Facebook | Instagram</div>
      </footer>
    </div>
  );
};

export default App;
