import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { signOut } from '../store/actions/AuthModel';

const SignedIn = ({ auth, profile, signOut }) => {
  const displayName = auth ? 
  auth.firstName[0]+'. '+auth.lastName 
  : profile 
  ?  profile.firstName[0]+'. '+profile.lastName 
  : '';
    const { t } = useTranslation();

  return (
    <div className="norrechel-navbar">
      <ul className="nav-link d-flex align-items-center">
        <li className="nav-item dropdown pe-3">
          <NavLink to="#" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
            <i className="bi bi-person"></i>
            <span className="d-none d-md-block dropdown-toggle ps-2">{displayName}</span>
          </NavLink>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile p-0">
            <li className="dropdown-header">
              <h6>{displayName}</h6>
            </li>
            <hr className="dropdown-divider" />
            <li>
              <NavLink to="/profile" className="dropdown-item d-flex align-items-center">
                <i className="bi bi-person"></i>
                <span>{t('profile')}</span>
              </NavLink>
            </li>
            <hr className="dropdown-divider" />
            <li>
              <NavLink to="/blog" className="dropdown-item d-flex align-items-center">
                <i className="bi bi-grid"></i>
                <span>{t('blogs')}</span>
              </NavLink>
            </li>
            <hr className="dropdown-divider" />
            <li>
              <button onClick={signOut} className="dropdown-item d-flex align-items-center text-danger" id="logout">
                <i className="lni lni-exit"></i>
                <span>{t('logout')}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => { 
  return{
    profile: state.auth.user.profile,
    // auth: state.auth.user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignedIn);
