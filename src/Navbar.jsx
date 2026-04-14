import "./Navbar.css";
import logoImage from "./assets/Logo.png";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="18" cy="19" r="1.4" />
    </svg>
  );
}

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <a className="brand-block" href="#home" aria-label="Tipsy home">
          <span className="brand-mark">
            <img src={logoImage} alt="Tipsy logo" />
          </span>
          <div>
            <span>Premium bottle delivery</span>
          </div>
        </a>

        <div className="nav-center">
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#best-sellers">Best Sellers</a>
            <a href="#categories">Categories</a>
            <a href="#why-tipsy">Why Tipsy</a>
          </div>

          <label className="search-shell" aria-label="Search products">
            <SearchIcon />
            <input type="text" placeholder="Search whisky, gin, wine..." />
          </label>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-button" type="button" aria-label="Account">
            <UserIcon />
          </button>

          <button className="cart-button" type="button" aria-label="Cart">
            <CartIcon />
            <span>Cart</span>
            <strong>2</strong>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
