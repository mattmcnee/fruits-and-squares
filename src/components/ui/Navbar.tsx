import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@firebase/useAuth";
import "./Navbar.scss";

import menuIcon from "/src/assets/menu.svg";
import beanIcon from "/src/assets/bean.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, logout } = useAuth();
  let title = "Fruits & Squares";

  console.log(user);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      if (newIsMobile) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false); // Close the dropdown on scroll
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = () => {
    return (
      <>
        {location.pathname !== "/" && (
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
        )}
        <Link to="/beans/new" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Beans</Link>
        <Link to="/mango/new" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Mango</Link>

        {user ? (
          <>
          <div className="navbar-link" onClick={() => { setIsMenuOpen(false); logout(); }}>Sign Out</div>
          {user?.photoURL && <div className="navbar-link"><img src={user.photoURL} className="navbar-icon" alt="Profile Icon" /></div>}
          </>
        ) : (
          !(location.pathname === "/signin" || location.pathname === "/signin/success") && (
            <Link to="/signin" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )
        )}
      </>
    );
  };

  return (
    <div className="navbar-page-spacing">
      <div className="navbar-container">
        <nav className="navbar">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            <img src={beanIcon} alt="Logo" />
            <div className="logo-name">{title}</div>
          </div>
          {isMobile ? (
            <button className="menu-toggle" onClick={toggleMenu}>
              <img src={menuIcon} alt="Toggle Menu Icon" />
            </button>
          ) : (
            <div className="navbar-links">
              <NavLinks />
            </div>
          )}
        </nav>
        {isMobile && (
          <div className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}>
            <NavLinks />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
