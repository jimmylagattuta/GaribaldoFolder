import "./App.css";
import navbarLogo from "./assets/logo-navbar.png";

function App() {
  return (
    <div className="page">
      <header className="navbar">
        <img
          src={navbarLogo}
          alt="Garibaldo's Nursery"
          className="navbar-logo"
        />
      </header>
    </div>
  );
}

export default App;