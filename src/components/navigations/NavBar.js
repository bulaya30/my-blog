import React from 'react'
import { Link } from 'react-router-dom'
import { useSidebar } from './SidebarContext';
import SignedIn from './SignedInLink'
import SignedOutLink from './SignedOutLink'
import { connect } from 'react-redux'
import Logo from '../../img/logo/Logo.png'
function NavBar(props) {
  const { auth } = props;
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    // d-none d-lg-flex = hide on screens < 992px, show as flex on ≥ 992px
    <header className="fixed-top header d-flex align-items-center">
      <Link to='/' className="logo d-flex align-items-center"> 
        <img src={Logo} alt="Norrechel Logo" height="40" /> {/* logo */}
        <span className="d-none d-lg-block">Norrechel</span>
      </Link>

      <i 
        className="bi bi-list toggle-sidebar-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      ></i>

      <div className="search-bar">
        <form className="search-form d-flex align-items-center">
          <input type="search" id="search" name="search" placeholder="Search" title="Enter search keyword" autoComplete="off" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
        <div className="control" id="search-menu"></div>
      </div>

      <nav className="header-nav ms-auto">
        {auth ? <SignedIn /> : <SignedOutLink /> }
      </nav>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
  }
}
export default connect(mapStateToProps)(NavBar)
