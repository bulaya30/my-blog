import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedIn from './SignedInLink'
import SignedOutLink from './SignedOutLink'
import Logo from '../../img/logo/Logo.png'
// import './NavBar.css' // Make sure this file handles the responsive styles

function NavBar({ auth }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to='/' className="logo d-flex align-items-center"> 
          <img src={Logo} alt="Norrechel Logo" height="40" /> 
          <span className="d-none d-lg-block">Norrechel</span>
        </Link>
      </div>
      <nav className={menuOpen ? "nav-open" : ""}>
        <ul className="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link></li>
          <li><Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          {auth ? <SignedIn /> : (
            <>
              <li><Link to="/login" className="auth-btn my-2 my-md-0" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="auth-btn" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className="bx bx-menu"></i>
      </button>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
  }
}

export default connect(mapStateToProps)(NavBar)
