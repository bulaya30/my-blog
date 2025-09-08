import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignedIn from './SignedInLink';
import { useSidebar } from '../context/sidebarContext';
import Logo from '../../img/logo/Logo.png';

function NavBar({ auth }) {
  const { t, i18n } = useTranslation();

  const { toggleSidebar } = useSidebar(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null); // reference for dropdown

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleLang = () => setLangOpen(prev => !prev);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/" className="logo d-flex align-items-center"> 
          <img src={Logo} alt="Norrechel Logo" height="40" /> 
          <span className="d-none d-lg-block">Norrechel</span>
        </Link>
      </div>

      {/* Sidebar toggler */}
      <button className="menu-toggle" id="sidebar-toggle" onClick={toggleSidebar}>
        <i className="bx bx-menu-alt-left"></i>
      </button>

      {/* Main Nav links */}
      <nav className={menuOpen ? "nav-open" : ""}>
        <ul className="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>{t('home')}</Link></li>
          <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>{t('blogs')}</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>{t('about')}</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>{t('contact')}</Link></li>
          {auth ? (
            <SignedIn />
          ) : (
            <>
              <li><Link to="/login" className="auth-btn my-2 my-md-0" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="auth-btn" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}

          {/* Language Dropdown */}
          <li className="language-dropdown" ref={langRef}>
            <button className="lang-btn" onClick={toggleLang}>
              🌐 {i18n.language.toUpperCase()} ▼
            </button>
            {langOpen && (
              <ul className="lang-menu">
                <li onClick={() => changeLanguage("en")}>English</li>
                <li onClick={() => changeLanguage("fr")}>Français</li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile nav toggle */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className="bx bx-menu"></i>
      </button>
    </header>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth.user,
});

export default connect(mapStateToProps)(NavBar);
